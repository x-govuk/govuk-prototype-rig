import _ from 'lodash'
import { _normalize } from '../nunjucks.js'

/**
 * Convert array to a list formatted as a sentence.
 *
 * @example
 * formatList(['England', 'Scotland', 'Wales'])
 * // England, Scotland and Wales
 *
 * @example
 * formatList(['England', 'Scotland', 'Wales'], 'disjunction')
 * // England, Scotland or Wales
 *
 * @param {Array} array - Array to convert
 * @param {string} [type=conjunction] - Format of output
 * @returns {string} Formatted list
 */
export function formatList (array, type = 'conjunction') {
  array = _normalize(array, '')

  const listFormat = new Intl.ListFormat('en-GB', {
    style: 'long',
    type
  })
  return listFormat.format(array)
}

/**
 * Check if `value` is classified as an `Array` object.
 *
 * @example
 * isArray(['england', 'scotland', 'wales']) // true
 *
 * @example
 * isArray('great britain') // false
 *
 * @param {*} value - Value to check
 * @return {boolean} Returns `true` if `value` is an array, else `false`
 */
export function isArray (value) {
  value = _normalize(value, '')

  return _.isArray(value)
}

/**
 * Reject items in an array that have a key with a given value.
 *
 * @example
 * rejectFromArray([{
 *   name: 'Sally Smith'
 *   role: 'admin'
 * }, {
 *   name: 'David Jones'
 *   role: 'user'
 * }], 'role', 'admin')
 *
 * // [{
 * //  name: 'David Jones'
 * //  role: 'user'
 * // }]
 *
 * @param {Array} array - Array to filter
 * @param {string} key - Key to filter on
 * @param {string} value - Value to filter by
 * @returns Filtered array
 */
export function rejectFromArray (array, key, value) {
  return array.filter(item => !value.includes(_.get(item, key)))
}

/**
 * Select items in an array that have a key with a given value.
 *
 * @example
 * selectFromArray([{
 *   name: 'Sally Smith'
 *   role: 'admin'
 * }, {
 *   name: 'David Jones'
 *   role: 'user'
 * }], 'role', 'admin')
 *
 * // [{
 * //  name: 'Sally Smith'
 * //  role: 'admin'
 * // }]
 *
 * @param {Array} array - Array to filter
 * @param {string} key - Key to filter on
 * @param {string} value - Value to filter by
 * @returns Filtered array
 */
export function selectFromArray (array, key, value) {
  return array.filter(item => value.includes(_.get(item, key)))
}

export const arrayFilters = {
  formatList,
  isArray,
  rejectFromArray,
  selectFromArray
}
