import _ from 'lodash'

/**
 * Check if a property value exists.
 *
 * Note: You do not need to use this helper if you are using the `decorate`
 * attribute provided by the govuk-prototype-components package.
 * It’s provided by the rig to provide compatibility with prototypes built
 * using the GOV.UK Prototype Kit.
 *
 * @see {@link https://govuk-prototype-kit.herokuapp.com/docs/examples/pass-data}
 *
 * @param {string} keyPath - Path to key (using dot/bracket notation)
 * @param {string} value - Value to check
 * @returns {boolean} Returns `true` if `value` exists, else `false`
 */
export function checked (keyPath, value) {
  keyPath = _.toPath(keyPath)

  const { data } = this.ctx
  if (!data) {
    return ''
  }

  const storedValue = data[keyPath]
  if (!storedValue) {
    return ''
  }

  let checkedValue = ''

  if (Array.isArray(storedValue)) {
    // Stored value is an array, check it exists in the array
    if (storedValue.indexOf(value) !== -1) {
      checkedValue = 'checked'
    }
  } else {
    // Stored value is a simple value, check it matches
    if (storedValue === value) {
      checkedValue = 'checked'
    }
  }

  return checkedValue
}
