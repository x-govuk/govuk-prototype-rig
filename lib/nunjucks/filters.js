/**
 * Filters available for use in Nunjucks templates.
 *
 * @module filters
 */

/**
 * Log an object in the template to the console in the browser.
 *
 * @example {{ "hello world" | log }}
 *
 * @param {*} a Any type
 * @return {string} A script tag with a `console.log` call.
 */
export function log (a) {
  const nunjucksSafe = this.ctx.settings.nunjucksEnv.getFilter('safe')
  return nunjucksSafe(`<script>console.log(${JSON.stringify(a, null, '\t')});</script>`)
}

export const libFilters = {
  log
}
