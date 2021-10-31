import _ from 'lodash'
import { _normalize } from '../../lib/nunjucks.js'

/**
 * Checks if `value` is the language type of `Object`.
 *
 * @example
 * isObject({country: 'england'}) // true
 *
 * @example
 * isObject(['england', 'scotland', 'wales']) // true
 *
 * @example
 * isArray('great britain') // false
 *
 * @param {*} value - Value to check
 * @return {boolean} Returns `true` if `value` is an object, else `false`
 */
export function isObject (value) {
  value = _normalize(value, '')

  return _.isObject(value)
}

export const objectFilters = {
  isObject
}
