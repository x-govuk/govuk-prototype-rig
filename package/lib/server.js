import { createRequire } from 'node:module'
import dotenv from 'dotenv'
import express from 'express'
import sessionInCookie from 'client-sessions'
import sessionInMemory from 'express-session'

import { authentication } from './middleware/authentication.js'
import { autoStoreData } from './middleware/auto-store-data.js'
import { forceHttps } from './middleware/force-https.js'
import { matchRoutes } from './middleware/match-routes.js'
import { browserSyncConfig } from './browser-sync.js'
import { findAvailablePort, getEnvBoolean } from './environment.js'
import { getBreadcrumbItems, getSideNavigationItems, markdownPages } from './markdown-pages.js'
import { getNunjucksEnv } from './nunjucks.js'
import routes from '../../app/routes.js'

// Import meta data from app manifest
const require = createRequire(import.meta.url)
const appJson = require('../../app.json')

// Run before other code to make sure variables from .env are available
dotenv.config()

// Set up configuration variables
const serviceName = appJson.name
const glitchEnv = process.env.PROJECT_REMIX_CHAIN ? 'production' : false // glitch.com
const env = process.env.NODE_ENV || glitchEnv || 'development'
const promoMode = getEnvBoolean('PROMO_MODE')
const useAuth = getEnvBoolean('USE_AUTH', appJson)
const useAutoStoreData = getEnvBoolean('USE_AUTO_STORE_DATA', appJson)
const useCookieSessionStore = getEnvBoolean('USE_COOKIE_SESSION_STORE', appJson)
const useHttps = getEnvBoolean('USE_HTTPS', appJson)

// Set up Express app
const app = express()

// Add variables that are available in all views
app.locals.env = env
app.locals.serviceName = serviceName
app.locals.useAuth = useAuth
app.locals.useAutoStoreData = useAutoStoreData
app.locals.useCookieSessionStore = useCookieSessionStore

// Force HTTPS on production. Do this before using basicAuth to avoid
// asking for username/password twice (for `http`, then `https`).
const isSecure = (env === 'production' && useHttps)
if (isSecure) {
  app.use(forceHttps)
  app.set('trust proxy', 1) // Needed for secure cookies on Heroku
}

// Authentication middleware
app.use(authentication)

// Set views engine
app.engine('njk', getNunjucksEnv(app, env).render)
app.set('view engine', 'njk')

// Serve static assets
app.use('/public', express.static('./public'))
app.use('/govuk/assets', express.static('./node_modules/govuk-frontend/govuk/assets'))

// Support parsing data in POSTs
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

// Session uses `serviceName` to avoid clashes with other prototypes
const sessionName = 'govuk-prototype-rig-' + (Buffer.from(serviceName, 'utf8')).toString('hex')
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
  app.use(autoStoreData)
  app.get('/auto-store-data.js', (req, res) => {
    res.sendFile('auto-store-data.js', {
      root: './node_modules/govuk-prototype-rig/lib'
    })
  })
}

// Clear all data in session
app.post('/clear-session-data', (req, res) => {
  req.session.data = {}
  res.render('clear-session-data', {
    success: true
  })
})

// Documentation
app.get('/docs/:view?*', markdownPages.middleware, async (req, res) => {
  // Use promo layout for documentation landing page
  const view = req.params.view ? 'documentation' : 'promo'
  const { page, navigation } = res.locals.markdownPages

  res.render(view, {
    breadcrumbItems: getBreadcrumbItems(navigation),
    sideNavigationItems: await getSideNavigationItems(),
    page,
    current: navigation.current
  })
})

// Redirect root to /docs when in promo mode.
if (promoMode) {
  app.get('/', (req, res) => res.redirect('/docs'))
}

// Feature flags
app.post('/feature-flags', (req, res) => {
  for (const key in req.body.features) {
    const flag = req.body.features[key]
    if (flag.on === 'true') {
      req.session.data.features[key].on = true
    } else {
      req.session.data.features[key].on = false
    }
  }

  res.render('feature-flags', {
    success: true
  })
})

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

// Load routes (found in app/routes.js)
app.use('/', routes)

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

// Redirect all POSTs to GETs (this allows users to use POST for autoStoreData)
app.post(/^\/([^.]+)$/, (req, res) => {
  res.redirect('/' + req.params[0])
})

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404)
  res.render('404')
})

// Display error
app.use((error, req, res, next) => {
  console.error(error.message)
  const status = error.status || 500
  res.status(status)
  res.render('500', {
    error: error.message,
    status
  })
})

findAvailablePort(app, (port) => {
  if (process.env.NODE_ENV === 'production') {
    console.info(`Listening on port ${port}`)
    app.listen(port)
  } else {
    const proxyPort = port - 50
    app.listen(proxyPort, () => browserSyncConfig(app, port, proxyPort))
  }
})
