import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import express from 'express'
import nunjucks from 'nunjucks'
import sessionInCookie from 'client-sessions'
import sessionInMemory from 'express-session'

import { authentication } from './middleware/authentication.js'
import { autoStoreData } from './middleware/auto-store-data.js'
import { forceHttps } from './middleware/force-https.js'
import { matchRoutes } from './middleware/match-routes.js'
import { loadFilters, loadGlobals } from './utils/nunjucks.js'
import { getEnvBoolean } from './utils/environment.js'
import routes from '../app/routes.js'

// Import meta data from app manifest
const appJsonPath = fileURLToPath(new URL('../app.json', import.meta.url))
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'))

// Run before other code to make sure variables from .env are available
dotenv.config()

// Set up configuration variables
const serviceName = appJson.name
const glitchEnv = process.env.PROJECT_REMIX_CHAIN ? 'production' : false // glitch.com
const env = process.env.NODE_ENV || glitchEnv || 'development'
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
  app.set('trust proxy', 1) // needed for secure cookies on heroku
}

// Authentication middleware
app.use(authentication)

// Nunjucks view paths
const appViews = [
  './node_modules/govuk-frontend',
  './app/components',
  './app/layouts',
  './app/views',
  './lib/views'
]

// Create Nunjucks environment
const nunjucksAppEnv = nunjucks.configure(appViews, {
  autoescape: true,
  express: app,
  noCache: true,
  watch: env === 'development'
})

// Load all Nunjucks filters and globals
loadFilters(nunjucksAppEnv)
loadGlobals(nunjucksAppEnv)

// Set views engine
app.set('view engine', 'njk')

// Serve static assets
app.use('/docs', express.static('./docs'))
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
}

// Clear all data in session
app.post('/clear-session-data', (req, res) => {
  req.session.data = {}
  res.render('clear-session-data', {
    success: true
  })
})

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

export default app
