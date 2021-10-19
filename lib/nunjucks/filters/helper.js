import { nunjucksUtils } from '../utils.js'
import { stringFilters } from './string.js'

/**
 * Convert decorated `govukDateInput` field values to human readable date.
 *
 * The `decorate()` method outputs fields in `govukDateInput` as an object with
 * `day`, `month` and `year` values. We can convert this into ISO 8601 format,
 * then use the `date` filter to convert this into a human readbable date.
 *
 * @example
 *
 *   {{ { day: '12', month: '11', year: '2021' } | dateFromObject }}
 *
 *   // 12 October 2021
 *
 * @module filters
 * @param {Object} object Date object
 * @return {string} Human readbable date
 */
export function dateFromObject (object) {
  object = nunjucksUtils.normalize(object, '')

  const date = Object.values(object).reverse().join('-')
  return stringFilters.date(date)
}

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
  return nunjucksUtils.safe(this.ctx, `<script>console.log(${JSON.stringify(a, null, '\t')});</script>`)
}

export const helperFilters = {
  dateFromObject,
  log
}
