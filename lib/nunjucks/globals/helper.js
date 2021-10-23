import _ from 'lodash'

/**
 * Check if a property value exists.
 *
 * Note: You do not need to use this helper if you are using the
 * `decorate` helper.
 *
 * @param {string} keyPath - Path to key (using dot/bracket notation)
 * @param {string} value - Value to check
 * @returns {boolean} Returns `true` if `value` exists, else `false`
 * @tutorial nunjucks-globals
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

/**
 * Add `name`, `value`, `id`, `idPrefix` and `checked`/`selected` attributes
 * to GOV.UK form inputs. Generates attributes based on where they are stored
 * in the session data object.
 *
 * @param {string} params - Component parameters
 * @param {string} keyPath - Path to key (using dot/bracket notation)
 * @returns {Object} Updated component parameters
 * @tutorial nunjucks-globals
 */
export function decorate (params, keyPath) {
  keyPath = _.toPath(keyPath)

  const { data, errors } = this.ctx
  if (!data) {
    return ''
  }

  const storedValue = _.get(data, keyPath)

  // Strip data from key path as auto store data middleware adds it
  if (keyPath[0] === 'data') {
    keyPath.shift(1)
  }

  params.id = (params.id) ? params.id : keyPath.join('-')
  params.name = (params.name) ? params.name : keyPath.map(s => `[${s}]`).join('')

  if (params.items) {
    params.idPrefix = params.id
    params.items = params.items.map(item => {
      // Ignore divider items
      if (item.divider) {
        return item
      }

      // Update date input items based on `decorate` value
      switch (item.decorate) {
        case 'day':
          item.classes = item.classes || 'govuk-input--width-2'
          item.id = `${params.id}-day`
          item.name = `${params.name}[day]`
          item.label = item.label || 'Day'
          item.value = storedValue?.day
          break
        case 'month':
          item.classes = item.classes || 'govuk-input--width-2'
          item.id = `${params.id}-month`
          item.name = `${params.name}[month]`
          item.label = item.label || 'Month'
          item.value = storedValue?.month
          break
        case 'year':
          item.classes = item.classes || 'govuk-input--width-4'
          item.id = `${params.id}-year`
          item.name = `${params.name}[year]`
          item.label = item.label || 'Year'
          item.value = storedValue?.year
          break
        default:
          if (typeof item.value === 'undefined') {
            item.value = item.text
          }
      }

      let checkedValue = ''
      let selectedValue = ''

      if (Array.isArray(storedValue)) {
        // Stored value is an array, check it exists in the array
        if (storedValue.indexOf(item.value) !== -1) {
          checkedValue = 'checked'
          selectedValue = 'selected'
        }
      } else {
        // Stored value is a simple value, check it matches
        if (storedValue === item.value) {
          checkedValue = 'checked'
          selectedValue = 'selected'
        }
      }

      item.checked = checkedValue
      item.selected = selectedValue

      return item
    })
  } else {
    // Check for undefined because the value may exist and be intentionally blank
    if (typeof params.value === 'undefined') {
      params.value = storedValue
    }
  }

  const errorKeyPath = keyPath.join('.')
  if (errors && errors[errorKeyPath]) {
    params.errorMessage = {
      text: errors[errorKeyPath].msg
    }
  }

  return params
}

/**
 * Transform errors provided by express-validator into an array that can be
 * consumed by the error summary component.
 *
 * If a field has multiple errors, return only the first error.
 *
 * @param {Object} errorMap - Mapped error response from express-validator
 * @returns {Array} List of errors
 * @tutorial nunjucks-globals
 */
export function errorList (errorMap) {
  const errorList = []
  const fieldsWithErrors = Object.entries(errorMap)

  for (const fieldError of fieldsWithErrors) {
    const fieldErrorId = _.toPath(fieldError[1].param).join('-')
    errorList.push({
      text: fieldError[1].msg,
      href: `#${fieldErrorId}`
    })
  }

  return errorList
}

export const helperGlobals = {
  checked,
  decorate,
  errorList
}
