import { DateTime, Settings } from 'luxon'
import { _normalize } from '../../utils/nunjucks.js'

Settings.throwOnInvalid = true

/**
 * Convert an ISO 8601 datetime to a human readable date that follows the
 * GOV.UK style.
 *
 * @see {@link https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style#dates}
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
 * Format an ISO 8601 datetime or time to a human readable time that follows
 * the GOV.UK style.
 *
 * @see {@link https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style#times}
 *
 * @example <caption>Full datetime</caption>
 * govukTime('2021-08-17T18:30:00') // 6:30pm
 *
 * @example <caption>Full datetime (which is midnight)</caption>
 * govukTime('2021-08-17T00:00:59') // midnight
 *
 * @example <caption>Full datetime (which is midday)</caption>
 * govukTime('2021-08-17T12:00:59') // midday
 *
 * @example <caption>Time only</caption>
 * govukTime('18:30') // 6:30pm
 *
 * @example <caption>The time now</caption>
 * govukTime('now') // 10:45pm
 *
 * @param {string} string - Time
 * @return {string} `string` as a human readbable time
 */
export function govukTime (string) {
  string = _normalize(string, '')

  try {
    if (string === 'now' || string === 'today') {
      string = DateTime.now().toString()
    }

    const date = DateTime.fromISO(string)

    // If o’clock, don’t show the minutes past the hour
    const hour = date.toFormat('h:mm').replace(':00', '')

    // Use a lowercase meridiem indicator
    const meridiem = date.toFormat('a').toLowerCase()

    // Show the hour followed by meridiem indicator (no space)
    let time = `${hour}${meridiem}`

    // If the time is 12:00am, show ‘midnight’ instead
    if (time === '12am') {
      time = 'midnight'
    }

    // If the time is 12:00pm, show ‘midday’ instead
    if (time === '12pm') {
      time = 'midday'
    }

    return time
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
  govukTime,
  isoDateFromDateInput
}
