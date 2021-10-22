import { DateTime, Settings } from 'luxon'
import { nunjucksUtils } from '../utils.js'

Settings.throwOnInvalid = true

/**
 * Convert an ISO 8601 date to a human readable value.
 *
 * @example <caption>Today’s date:</caption>
 *
 *   {{ "today" | govukDate }}
 *   {{ "now" | govukDate }}
 *
 *   // 21 October 2021 (today’s date)
 *
 * @example <caption>Full date:</caption>
 *
 *   {{ "2021-08-17" | govukDate }}
 *
 *   // 17 August 2021
 *
 * @example <caption>Full date (truncated):</caption>
 *
 *   {{ "2021-08-17" | govukDate("truncate") }}
 *
 *   // 17 Aug 2021
 *
 * @example <caption>Month and year only:</caption>
 *
 *   {{ "2021-08" | govukDate }}
 *
 *   // August 2021
 *
 * @example <caption>Month and year only (truncated):</caption>
 *
 *   {{ "2021-08" | govukDate("truncate") }}
 *
 *   // Aug 2021
 *
 * @module filters
 * @param {string} string Date
 * @param {boolean} [format=false] Date format (currently accepts ‘truncate’)
 * @return {string} Human readbable date
 */
export function govukDate (string, format = false) {
  string = nunjucksUtils.normalize(string, '')

  try {
    if (string === 'today' || string === 'now') {
      string = DateTime.now().toString()
    }

    const isoDateRegex = /^\d{4}-(?:[0]\d|1[0-2])$/
    const dateHasNoDay = isoDateRegex.test(string)
    const truncateDate = format === 'truncate'
    const date = DateTime.fromISO(string)

    // 2021-08 => August 2021
    // 2021-08 => Aug 2021 (truncated)
    if (dateHasNoDay) {
      const tokens = truncateDate ? 'MMM yyyy' : 'MMMM yyyy'
      return date.toFormat(tokens)
    }

    // 2021-08-17 => 17 August 2021
    // 2021-08-17 => 17 Aug 2021 (truncated)
    const preset = truncateDate ? 'DATE_MED' : 'DATE_FULL'
    return date.toLocaleString(DateTime[preset])
  } catch (error) {
    console.error(error.message)
    return error.message.split(':')[0]
  }
}

/**
 * Convert decorated `govukDateInput` field values to an ISO 8601 date.
 *
 * The `decorate()` method applied to a `govukDateInput` creates an object with
 * `day`, `month` and `year` values. We can convert this into ISO 8601 format.
 *
 * @example <caption>Full date:</caption>
 *
 *   {{ { day: '17', month: '08', year: '2021' } | isoDateFromDateInput }}
 *
 *   // 2021-08-17
 *
 * @example <caption>Month and year only:</caption>
 *
 *   {{ { month: '08', year: '2021' } | isoDateFromDateInput }}
 *
 *   // 2021-08
 *
 * @module filters
 * @param {Object} object Date object
 * @return {string} ISO 8601 date
 */
export function isoDateFromDateInput (object) {
  object = nunjucksUtils.normalize(object, '')

  try {
    const year = parseInt(object.year) || new Date().getFullYear()
    const month = parseInt(object.month)

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
  govukDate,
  isoDateFromDateInput
}
