/**
 * Normalise value provided to a filter. Checks that a given value exists
 * before performing a transformation.
 *
 * @access private
 * @param {*} value - Input value
 * @param {*} defaultValue - Value to fallback to if no value given
 * @returns defaultValue
 */
export function _normalize (value, defaultValue) {
  if (value === null || value === undefined || value === false) {
    return defaultValue
  }

  return value
}
