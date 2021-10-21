import { DateTime, Settings } from 'luxon'
import { nunjucksUtils } from '../utils.js'

Settings.throwOnInvalid = true

/**
 * Convert decorated `govukDateInput` field values to an ISO 8601 date.
 *
 * The `decorate()` method applied to a `govukDateInput` creates an object with
 * `day`, `month` and `year` values. We can convert this into ISO 8601 format.
 *
 * @example <caption>Full date:</caption>
 *
 *   {{ { day: '12', month: '11', year: '2021' } | isoDateFromDateInput }}
 *
 *   // 2021-11-21
 *
 * @example <caption>Month and year only:</caption>
 *
 *   {{ { month: '11', year: '2021' } | isoDateFromDateInput }}
 *
 *   // 2021-11
 *
 * @module filters
 * @param {Object} object Date object
 * @return {string} ISO 8601 date
 */
export function isoDateFromDateInput (object) {
  object = nunjucksUtils.normalize(object, '')

  const year = parseInt(object.year) || new Date().getFullYear()
  const month = parseInt(object.month)

  try {
    if (!object.day) {
      return DateTime.local(year, month).toFormat('yyyy-LL')
    } else {
      const day = parseInt(object.day)
      return DateTime.local(year, month, day).toISODate()
    }
  } catch (error) {
    console.error(error.message)
    return error.message.split(':')[0]
  }
}

export const dateFilters = {
  isoDateFromDateInput
}
