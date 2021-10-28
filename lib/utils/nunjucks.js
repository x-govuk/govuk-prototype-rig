import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

import { arrayFilters } from '../nunjucks/filters/array.js'
import { dateFilters } from '../nunjucks/filters/date.js'
import { helperFilters } from '../nunjucks/filters/helper.js'
import { numberFilters } from '../nunjucks/filters/number.js'
import { objectFilters } from '../nunjucks/filters/object.js'
import { stringFilters } from '../nunjucks/filters/string.js'
import { helperGlobals } from '../nunjucks/globals/helper.js'

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
 * @param {Object} nunjucksAppEnv - Nunjucks environment
 */
export async function loadFilters (nunjucksAppEnv) {
  // Add library filters to Nunjucks environment
  const filters = {
    ...arrayFilters,
    ...dateFilters,
    ...helperFilters,
    ...numberFilters,
    ...objectFilters,
    ...stringFilters
  }

  for (const filter of Object.keys(filters)) {
    nunjucksAppEnv.addFilter(filter, filters[filter])
  }

  // Add any app filters to Nunjucks environment
  // Library filters can be accessed by app filters using env.getFilter()
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
 * @param {Object} nunjucksAppEnv - Nunjucks environment
 */
export async function loadGlobals (nunjucksAppEnv) {
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
