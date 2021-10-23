/**
 * Log an object to the console in the browser.
 *
 * @example
 *
 *   {{ "hello world" | log }}
 *
 * @module filters
 * @param {*} a Any type
 * @return {string} A script tag with a `console.log` call.
 */
export function log (a) {
  const safe = this.ctx.settings.nunjucksEnv.getFilter('safe')
  return safe(`<script>console.log(${JSON.stringify(a, null, '\t')});</script>`)
}

export const helperFilters = {
  log
}
