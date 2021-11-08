import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import nunjucks from 'nunjucks'

import { arrayFilters } from '../rig/filters/array.js'
import { dateFilters } from '../rig/filters/date.js'
import { numberFilters } from '../rig/filters/number.js'
import { objectFilters } from '../rig/filters/object.js'
import { stringFilters } from '../rig/filters/string.js'
import { helperGlobals } from '../rig/globals/helper.js'

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
  // Add package filters to Nunjucks environment
  const filters = {
    ...arrayFilters,
    ...dateFilters,
    ...numberFilters,
    ...objectFilters,
    ...stringFilters
  }

  for (const filter of Object.keys(filters)) {
    nunjucksAppEnv.addFilter(filter, filters[filter])
  }

  // Add any app filters to Nunjucks environment
  // App filters can access package filters using env.getFilter()
  const appFiltersPath = fileURLToPath(new URL('../../app/filters.js', import.meta.url))

  let appFilters
  if (fs.existsSync(appFiltersPath)) {
    appFilters = await import(appFiltersPath)
    appFilters = appFilters.default(nunjucksAppEnv)

    for (const filter of Object.keys(appFilters)) {
      nunjucksAppEnv.addFilter(filter, appFilters[filter])
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
  const appGlobalsPath = fileURLToPath(new URL('../../app/globals.js', import.meta.url))

  let appGlobals
  if (fs.existsSync(appGlobalsPath)) {
    appGlobals = await import(appGlobalsPath)
    appGlobals = appGlobals.default()
  }

  const globals = {
    ...helperGlobals,
    ...appGlobals
  }

  for (const global of Object.keys(globals)) {
    nunjucksAppEnv.addGlobal(global, globals[global])
  }
}

export const getNunjucksEnv = (app, env) => {
  const appViews = [
    './node_modules/govuk-frontend',
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
