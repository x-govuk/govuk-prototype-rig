import _ from 'lodash'
import { _normalize } from '../../lib/nunjucks.js'

/**
 * Checks if `value` is classified as an `Array` object.
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

export const arrayFilters = {
  isArray
}
