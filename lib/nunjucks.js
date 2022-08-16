import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
import nunjucks from 'nunjucks'
import { filters } from './filters/index.js'
import { globals } from './globals/index.js'

/**
 * Merge provided filters with any added by the prototype author.
 * App filters can access package filters using `env.getFilter()`.
 *
 * @access private
 * @param {Object} nunjucksAppEnv - Nunjucks environment
 */
async function _addFilters (nunjucksAppEnv) {
  for (const filter of Object.keys(filters)) {
    nunjucksAppEnv.addFilter(filter, filters[filter])
  }

  let appFilters
  let appFiltersPath = process.cwd() + '/app/filters.js'

  if (fs.existsSync(appFiltersPath)) {
    appFiltersPath = pathToFileURL(appFiltersPath).href
    appFilters = await import(appFiltersPath)
    appFilters = appFilters.default(nunjucksAppEnv)

    for (const filterName of Object.keys(appFilters)) {
      nunjucksAppEnv.addFilter(filterName, appFilters[filterName])
    }
  }
}

/**
 * Merge provided globals with any added by the prototype author.
 *
 * @access private
 * @param {Object} nunjucksAppEnv - Nunjucks environment
 */
async function _addGlobals (nunjucksAppEnv) {
  for (const global of Object.keys(globals)) {
    nunjucksAppEnv.addGlobal(global, globals[global])
  }

  let appGlobals
  let appGlobalsPath = process.cwd() + '/app/globals.js'

  if (fs.existsSync(appGlobalsPath)) {
    appGlobalsPath = pathToFileURL(appGlobalsPath).href
    appGlobals = await import(appGlobalsPath)
    appGlobals = appGlobals.default()
  }

  for (const globalName of Object.keys(appGlobals)) {
    nunjucksAppEnv.addGlobal(globalName, appGlobals[globalName])
  }
}

export const getNunjucksEnv = (app, env) => {
  const appViews = [
    './node_modules/govuk-frontend',
    './node_modules/govuk-decorated-components',
    './node_modules/govuk-prototype-components',
    './node_modules/govuk-prototype-rig/lib/views',
    './app',
    './app/views'
  ]

  // Create Nunjucks environment
  const nunjucksEnv = nunjucks.configure(appViews, {
    autoescape: true,
    express: app,
    noCache: true,
    watch: env === 'development'
  })

  // Load all Nunjucks filters and globals
  _addFilters(nunjucksEnv)
  _addGlobals(nunjucksEnv)

  return nunjucksEnv
}
