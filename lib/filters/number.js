import _ from 'lodash'
import { normalize } from '../utils.js'

/**
 * Check if a value is classified as a `Number` primitive or object.
 *
 * @example
 * isNumber(1801) // true
 *
 * @example
 * isNumber('1801') // false
 *
 * @param {*} value - Value to check
 * @return {boolean} Returns `true` if `value` is a number, else `false`
 */
export function isNumber (value) {
  value = normalize(value, '')

  return _.isNumber(value)
}

/**
 * Convert a number into an ordinal numeral.
 *
 * @see {@link https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style#ordinal-numbers}
 *
 * @example
 * ordinal(4) // fourth
 * ordinal(22) // 22nd
 *
 * @param {number} number - Value to convert
 * @return {string} Ordinal numeral or `number` with an ordinal suffix
 */
export function ordinal (number) {
  number = normalize(number, '')

  // Spell out first to ninth
  if (number < 10) {
    const ordinals = new Map([
      [1, 'first'],
      [2, 'second'],
      [3, 'third'],
      [4, 'fourth'],
      [5, 'fifth'],
      [6, 'sixth'],
      [7, 'seventh'],
      [8, 'eighth'],
      [9, 'ninth']
    ])

    return ordinals.get(number)
  }

  // After that use 10th, 11th and so on
  const rule = new Intl.PluralRules('en-GB', {
    type: 'ordinal'
  }).select(number)
  const suffixes = new Map([
    ['one', 'st'],
    ['two', 'nd'],
    ['few', 'rd'],
    ['other', 'th']
  ])
  const suffix = suffixes.get(rule)

  return `${number}${suffix}`
}

/**
 * Convert a number into a string formatted as pound sterling.
 *
 * @example
 * sterling(81932) // £81,932.00
 * sterling(133.66667) // £133.67
 * sterling(6.83) // £6.83
 *
 * @param {number} number - Value to convert
 * @return {string} `number` formatted as pound sterling
 */
export function sterling (number) {
  number = normalize(number, '')

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(number)
}

export const numberFilters = {
  isNumber,
  ordinal,
  sterling
}
