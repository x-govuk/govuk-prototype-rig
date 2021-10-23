import { DateTime, Settings } from 'luxon'
import { _normalize } from '../../utils/nunjucks.js'

Settings.throwOnInvalid = true

/**
 * Convert an ISO 8601 date to a human readable value.
 *
 * @example <caption>Full date</caption>
 * govukDate('2021-08-17') // 17 August 2021
 *
 * @example <caption>Full date (truncated)</caption>
 * govukDate('2021-08-17', 'truncate') // 17 Aug 2021
 *
 * @example <caption>Month and year only</caption>
 * govukDate('2021-08') // August 2021
 *
 * @example <caption>Month and year only (truncated)</caption>
 * govukDate('2021-08', 'truncate') // Aug 2021
 *
 * @example <caption>Today’s date</caption>
 * govukDate('today') // 21 October 2021
 * govukDate('today', 'truncate') // 21 Oct 2021
 *
 * @param {string} string - Date
 * @param {boolean|string} [format=false] - Date format (currently accepts ‘truncate’)
 * @return {string} `string` as a human readbable date
 */
export function govukDate (string, format = false) {
  string = _normalize(string, '')

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
 * @example <caption>Full date</caption>
 * isoDateFromDateInput({ day: '17', month: '08', year: '2021' }) // 2021-08-17
 *
 * @example <caption>Month and year only</caption>
 * isoDateFromDateInput({ month: '08', year: '2021' }) // 2021-08
 *
 * @param {Object} object - Date object
 * @return {string} `object` converted to a ISO 8601 date string
 */
export function isoDateFromDateInput (object) {
  object = _normalize(object, '')

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
