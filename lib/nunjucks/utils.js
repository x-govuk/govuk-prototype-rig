import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

import * as libFilters from './filters.js'
import * as libGlobals from './globals.js'

/**
 * Merge provided filters with any added by the prototype author.
 *
 * @access private
 * @param {Object} nunjucksAppEnv Nunjucks environment
 */
export async function loadFilters (nunjucksAppEnv) {
  const appFiltersPath = fileURLToPath(new URL('../../app/filters.js', import.meta.url))

  let appFilters
  if (fs.existsSync(appFiltersPath)) {
    appFilters = await import(appFiltersPath)
    appFilters = appFilters.default()
  }

  const filters = { ...libFilters, ...appFilters }
  for (const filter of Object.keys(filters)) {
    nunjucksAppEnv.addFilter(filter, filters[filter])
  }
}

/**
 * Merge provided globals with any added by the prototype author.
 *
 * @access private
 * @param {Object} nunjucksAppEnv Nunjucks environment
 */
export async function loadGlobals (nunjucksAppEnv) {
  const appFiltersPath = fileURLToPath(new URL('../../app/globals.js', import.meta.url))

  let appGlobals
  if (fs.existsSync(appFiltersPath)) {
    appGlobals = await import(appFiltersPath)
    appGlobals = appGlobals.default()
  }

  const globals = { ...libGlobals, ...appGlobals }
  for (const filter of Object.keys(globals)) {
    nunjucksAppEnv.addGlobal(filter, globals[filter])
  }
}
