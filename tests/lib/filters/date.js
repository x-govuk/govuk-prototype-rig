import test from 'ava'
import {
  govukDate,
  govukTime,
  isoDateFromDateInput
} from '../../../lib/filters/date.js'

const now = Date.now()

test('Converts an ISO 8601 datetime to a date using the GOV.UK style', t => {
  t.is(govukDate('2021-08-17'), '17 August 2021')
  t.is(govukDate('2021-08-17', 'truncate'), '17 Aug 2021')
  t.is(govukDate('2021-08'), 'August 2021')
  t.is(govukDate('2021-08', 'truncate'), 'Aug 2021')

  const govukDateToday = String(Date.parse(govukDate('today')))
  t.is(String(govukDateToday).slice(0, 4), String(now).slice(0, 4))

  const govukDateTodayTruncated = Date.parse(govukDate('today', 'truncate'))
  t.is(String(govukDateTodayTruncated).slice(0, 4), String(now).slice(0, 4))
})

test('Returns error converting an ISO 8601 datetime to a date using the GOV.UK style', t => {
  t.is(govukDate('2021-23-45'), 'Invalid DateTime')
})

test('Converts an ISO 8601 datetime to a time using the GOV.UK style', t => {
  t.is(govukTime('2021-08-17T18:30:00'), '6:30pm')
  t.is(govukTime('2021-08-17T00:00:59'), 'midnight')
  t.is(govukTime('2021-08-17T12:00:59'), 'midday')
  t.is(govukTime('18:30'), '6:30pm')
})

test('Returns error converting an ISO 8601 datetime to a time using the GOV.UK style', t => {
  t.is(govukTime('2021-08-17T25:61:00'), 'Invalid DateTime')
})

test('Converts decorated `govukDateInput` values to an ISO 8601 date', t => {
  t.is(isoDateFromDateInput({
    day: '17',
    month: '08',
    year: '2021'
  }), '2021-08-17')
  t.is(isoDateFromDateInput({
    month: '08',
    year: '2021'
  }), '2021-08')
})

test('Returns error converting decorated `govukDateInput` values to an ISO 8601 date', t => {
  t.is(isoDateFromDateInput({ foo: 'bar' }), 'Invalid DateTime')
})
