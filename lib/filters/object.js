import _ from 'lodash'
import { _normalize } from '../nunjucks.js'

/**
 * Check if `value` is the language type of `Object`.
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

/**
 * Transform object to an array, using key name as value for id.
 *
 * @example
 * objectToArray({
 *   1: { name: 'Sir Robert Walpole' },
 *   2: { name: 'Spencer Compton' },
 *   3: { name: 'Henry Pelham' },
 * })
 *
 * // [
 * //   { id: 1, name: 'Sir Robert Walpole' },
 * //   { id: 2, name: 'Spencer Compton' },
 * //   { id: 3, name: 'Henry Pelham' },
 * // ]
 *
 * @param {Object} object - Object to transform
 * @returns
 */
export function objectToArray (object) {
  const objectArray = []
  Object.keys(object).forEach(key => objectArray.push({
    ...{ id: key },
    ...object[key]
  }))

  return objectArray
}

export const objectFilters = {
  isObject,
  objectToArray
}
