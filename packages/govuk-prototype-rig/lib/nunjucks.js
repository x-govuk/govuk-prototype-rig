import fs from 'node:fs'
import nunjucks from 'nunjucks'
import { filters } from './filters/index.js'
import { globals } from './globals/index.js'

/**
 * Normalise value provided to a filter. Checks that a given value exists
 * before performing a transformation.
 *
 * @access private
 * @param {*} value - Input value
 * @param {*} defaultValue - Value to fallback to if no value given
 * @returns defaultValue
 */
export function _normalize (value, defaultValue) {
  if (value === null || value === undefined || value === false) {
    return defaultValue
  }

  return value
}

/**
 * Merge provided filters with any added by the prototype author.
 *
 * @access private
 * @param {Object} nunjucksAppEnv - Nunjucks environment
 */
async function _addFilters (nunjucksAppEnv) {
  for (const filter of Object.keys(filters)) {
    nunjucksAppEnv.addFilter(filter, filters[filter])
  }

  // Add any app filters to Nunjucks environment
  // App filters can access package filters using env.getFilter()
  const appFiltersPath = `${process.cwd()}/app/filters.js`

  let appFilters
  if (fs.existsSync(appFiltersPath)) {
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

  const appGlobalsPath = `${process.cwd()}/app/globals.js`

  let appGlobals
  if (fs.existsSync(appGlobalsPath)) {
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
    './node_modules/govuk-prototype-components',
    './node_modules/govuk-prototype-rig',
    './node_modules/govuk-prototype-rig/views',
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
