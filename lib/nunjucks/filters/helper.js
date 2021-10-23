/**
 * Log an object to the console in the browser.
 *
 * @param {*} value - Value to log
 * @return {string} A `script` tag with `value` in a `console.log` call
 */
export function log (value) {
  const safe = this.ctx.settings.nunjucksEnv.getFilter('safe')
  return safe(`<script>console.log(${JSON.stringify(value, null, '\t')});</script>`)
}

export const helperFilters = {
  log
}
