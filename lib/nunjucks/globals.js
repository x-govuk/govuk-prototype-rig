import * as utils from '../utils.js'

export default (env) => {
  const globals = {}

  /**
   * Check if a property value exists
   *
   * @example checked("field-name")
   * @example checked("['field-name']")
   * @example checked("['parent']['field-name']")
   *
   * @param {String} keyPath Path to key (using dot/bracket notation)
   * @param {String} value Value to check
   * @returns {boolean} Value exists
   */
  globals.checked = function (keyPath, value) {
    const { data } = this.ctx
    if (!data) {
      return ''
    }

    const storedValue = utils.getDataValue(data, keyPath)
    if (!storedValue) {
      return ''
    }

    let checked = ''

    // If data is an array, check it exists in the array
    if (Array.isArray(storedValue)) {
      if (storedValue.indexOf(value) !== -1) {
        checked = 'checked'
      }
    } else {
      // The data is just a simple value, check it matches
      if (storedValue === value) {
        checked = 'checked'
      }
    }

    return checked
  }

  /**
   * Add name, value, id, idPrefix and checked/selected attributes to GOV.UK
   * form inputs. Generates attributes based on where they are stored in the
   * session data object.
   *
   * @example {{ govukInput(decorate({
   *            label: { text: "Label" }
   *          }, "account.email")) }}
   *
   * @param {String} keyPath Path to key (using dot/bracket notation)
   * @param {String} value Value to check
   * @returns {boolean} Value exists
   */
  globals.decorate = function (params, keyPath) {
    keyPath = Array.isArray(keyPath) ? keyPath : [keyPath]

    // Convert keyPath to kebab-case
    // ['key-name'] => key-name
    // ['parent', 'key-name'] => parent-key-name
    const keyPathKebabCase = keyPath.join('-')

    // Convert keyPath to dot notation
    // ['key-name'] => key-name
    // ['parent', 'key-name'] => parent.key-name
    const keyPathDot = keyPath.join('.')

    // Convert keyPath to bracket notation
    // ['key-name'] => [key-name]
    // ['parent', 'key-name'] => [parent][key-name]
    const keyPathBracket = keyPath.map(s => `[${s}]`).join('')

    const { data, errors } = this.ctx
    if (!data) {
      return ''
    }

    const storedValue = utils.getDataValue(data, keyPath)

    params.id = keyPathKebabCase
    params.name = keyPathBracket

    if (params.items) {
      params.items = params.items.map(item => {
        let checked = storedValue ? '' : item.checked
        let selected = storedValue ? '' : item.selected

        if (!item.value) {
          item.value = item.text
        }

        // If data is an array, check it exists in the array
        if (Array.isArray(storedValue)) {
          if (storedValue.indexOf(item.value) !== -1) {
            checked = 'checked'
            selected = 'selected'
          }
        } else {
          // The data is just a simple value, check it matches
          if (storedValue === item.value) {
            checked = 'checked'
            selected = 'selected'
          }
        }

        item.checked = checked
        item.selected = selected
        return item
      })

      params.idPrefix = keyPathKebabCase
    } else {
      params.value = storedValue
    }

    if (errors && errors[keyPathDot]) {
      params.errorMessage = {
        text: errors[keyPathDot].msg
      }
    }

    return params
  }

  /**
   * Transform errors provided by express-validator into an array that can be
   * consumed by the error summary component
   *
   * If a field has multiple errors, return only the first error
   *
   * @param {object} errorMap Mapped error response from express-validator
   * @returns {Array} List of errors
   */
  globals.errorList = errorMap => {
    const errorList = []
    const fieldsWithErrors = Object.entries(errorMap)
    for (const fieldError of fieldsWithErrors) {
      errorList.push({
        text: fieldError[1].msg,
        href: `#${fieldError[1].param.replace('.', '-')}`
      })
    }

    return errorList
  }

  return globals
}
