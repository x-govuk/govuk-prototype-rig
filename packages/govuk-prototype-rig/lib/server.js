import fs from 'node:fs'
import express from 'express'
import rateLimit from "express-rate-limit";
import sessionInCookie from 'client-sessions'
import sessionInMemory from 'express-session'

import { authentication } from './middleware/authentication.js'
import { autoStoreData } from './middleware/auto-store-data.js'
import { forceHttps } from './middleware/force-https.js'
import { matchRoutes } from './middleware/match-routes.js'
import { autoStoreDataRoutes } from './routes/auto-store-data.js'
import { documentationRoutes } from './routes/documentation.js'
import { featureFlagRoutes } from './routes/feature-flags.js'
import { browserSyncConfig } from './browser-sync.js'
import { findAvailablePort, getEnvBoolean } from './environment.js'
import { getConfig } from './config.js'
import { getNunjucksEnv } from './nunjucks.js'

// Environment
const glitchEnv = process.env.PROJECT_REMIX_CHAIN ? 'production' : false // glitch.com
const env = process.env.NODE_ENV || glitchEnv || 'development'
const isProduction = env === 'production'

// Configuration
const config = await getConfig()
const promoMode = getEnvBoolean('PROMO_MODE', config)
const useAuth = getEnvBoolean('USE_AUTH', config)
const useAutoStoreData = getEnvBoolean('USE_AUTO_STORE_DATA', config)
const useCookieSessionStore = getEnvBoolean('USE_COOKIE_SESSION_STORE', config)
const useHttps = getEnvBoolean('USE_HTTPS', config)

// Set up Express app
const app = express()
const router = express.Router()
const limit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// Make config variables available to all views
app.locals = { ...app.locals, ...config}

// Force HTTPS on production. Do this before using authentication to avoid
// asking for username/password twice (for `http`, then `https`)
const isSecure = (isProduction && useHttps)
if (isSecure) {
  app.use(forceHttps)
  app.set('trust proxy', 1) // Needed for secure cookies on Heroku
}

// Authentication
if (isProduction && useAuth) {
  app.use(limit)
  app.use(authentication)
}

// Set views engine
app.engine(config.templateExtension, getNunjucksEnv(app, env).render)
app.set('view engine', config.templateExtension)

// Serve static assets
app.use('/public', express.static('./public'))
app.use('/govuk/assets', express.static('./node_modules/govuk-frontend/govuk/assets'))

// Form validation
app.use('/validate.js', express.static('./node_modules/validate.js/validate.js'))
app.use('/form-validation.js', express.static('./node_modules/govuk-prototype-rig/lib/form-validation.js'))

// Support parsing data in POSTs
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

// Session uses `config.serviceName` to avoid clashes with other prototypes
const uniqueId = (Buffer.from(config.serviceName, 'utf8')).toString('hex')
const sessionName = `govuk-prototype-rig-${uniqueId}`
const sessionOptions = {
  secret: sessionName,
  cookie: {
    maxAge: 1000 * 60 * 60 * 4, // 4 hours
    secure: isSecure
  }
}

// Support session data in cookie or memory
if (useCookieSessionStore) {
  app.use(sessionInCookie(Object.assign(sessionOptions, {
    cookieName: sessionName,
    proxy: true,
    requestKey: 'session'
  })))
} else {
  app.use(sessionInMemory(Object.assign(sessionOptions, {
    name: sessionName,
    resave: false,
    saveUninitialized: false
  })))
}

// Automatically store all data users enter
if (useAutoStoreData) {
  app.use(autoStoreData, autoStoreDataRoutes(router))
  app.use('/auto-store-data.js', express.static('./node_modules/govuk-prototype-rig/lib/auto-store-data.js'))
}

// Documentation
app.use(documentationRoutes(router))

// Feature flags
app.use(featureFlagRoutes(router))

// Prevent search indexing
// Setting headers stops pages being indexed even if indexed pages link to them.
app.use((req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex')
  next()
})

app.get('/robots.txt', (req, res) => {
  res.type('text/plain')
  res.send('User-agent: *\nDisallow: /')
})

// Redirect root to /docs when in promo mode
if (promoMode) {
  app.get('/', (req, res) => res.redirect('/docs'))
}

// Load routes
const appRoutesPath = `${process.cwd()}/app/routes.js`
if (fs.existsSync(appRoutesPath)) {
  const appRoutes = await import(appRoutesPath)
  app.use('/', appRoutes.default)
}

// Strip .html and .htm if provided
app.get(/\.html?$/i, (req, res) => {
  let { path } = req
  const parts = path.split('.')
  parts.pop()
  path = parts.join('.')
  res.redirect(path)
})

// Auto render any view that exists
app.get(/^([^.]+)$/, matchRoutes)

// Redirect POST requests to a GET requests, while preserving components of
// original URL, allowing users to use POST for autoStoreData.
app.post(/^\/([^.]+)$/, (req, res) => {
  res.redirect(req.originalUrl)
})

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404)
  res.render('404.njk')
})

// Display error
app.use((error, req, res, next) => {
  console.error(error.message)
  const status = error.status || 500
  res.status(status)
  res.render('500.njk', {
    error: error.message,
    status
  })
})

findAvailablePort(app, (port) => {
  if (isProduction) {
    console.info(`Listening on port ${port}`)
    app.listen(port)
  } else {
    const proxyPort = port - 50
    app.listen(proxyPort, () => browserSyncConfig(app, port, proxyPort))
  }
})
