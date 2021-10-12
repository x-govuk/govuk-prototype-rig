import _ from 'lodash'

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
    keyPath = _.toPath(keyPath)

    const { data } = this.ctx
    if (!data) {
      return ''
    }

    const storedValue = data[keyPath]
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
    keyPath = _.toPath(keyPath)

    const { data, errors } = this.ctx
    if (!data) {
      return ''
    }

    const storedValue = data[keyPath]

    params.id = (params.id) ? params.id : keyPath.join('-')
    params.name = (params.name) ? params.name : keyPath.map(s => `[${s}]`).join('')

    if (params.items) {
      params.idPrefix = params.id
      params.items = params.items.map(item => {
        // Ignore dividers
        if (item.divider) {
          return item
        }

        let checked = storedValue ? '' : item.checked
        let selected = storedValue ? '' : item.selected

        /**
         * govukDateInput also accepts an `items` param, but it is optional.
         *
         * If `items` is not provided, day, month and year inputs are shown by
         * default. The `name` value for each item is taken from either
         * `params.namePrefix` or one of the default `item.name` values. This
         * creates invalid object paths like `['user']['date-of-birth']-day`,
         * or incorrect name values like `day`.
         *
         * To save authors needing to override each item individually, enable
         * correct decoration of individual inputs via a new `decorate` param.
         * This will pass though any additional options that are provided:
         *
         *   items: [{
         *     decorate: "day",
         *     autocomplete: "bday-day"
         *   }, {
         *     decorate: "month",
         *     autocomplete: "bday-month"
         *   }, {
         *     decorate: "year",
         *     autocomplete: "bday-year"
         *   }]
         */
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
        }

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
