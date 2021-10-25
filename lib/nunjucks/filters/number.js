import _ from 'lodash'
import { _normalize } from '../../utils/nunjucks.js'

/**
 * Checks if `value` is classified as a `Number` primitive or object.
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
  value = _normalize(value, '')

  return _.isNumber(value)
}

/**
 * Convert a number into a string formatted as pound sterling.
 *
 * @example
 * sterling(81932) // £81,932
 *
 * @param {number} number - Value to convert
 * @return {string} `number` formatted as pound sterling
 */
export function sterling (number) {
  number = _normalize(number, '')

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(number)
}

export const numberFilters = {
  isNumber,
  sterling
}
