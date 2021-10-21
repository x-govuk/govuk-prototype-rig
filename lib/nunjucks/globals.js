import _ from 'lodash'

/**
 * Global helpers available for use in Nunjucks templates.
 *
 * @module globals
 */

/**
 * Check if a property value exists.
 *
 * Note: You do not need to use this helper if you are using the
 * `decorate` helper.
 *
 * @example
 * {{ govukCheckboxes({
 *   fieldset: {
 *     legend: {
 *       text: "Which of these applies to your vehicle?"
 *     }
 *   },
 *   items: [{
 *     value: "Heated seats",
 *     text: "Heated seats",
 *     checked: checked("vehicle-features", "Heated seats")
 *   }, {
 *     value: "GPS",
 *     text: "GPS",
 *     id: "vehicle-features-gps",
 *     checked: checked("['vehicle1']['vehicle-features']", "GPS")
 *   }, {
 *     value: "Radio",
 *     text: "Radio",
 *     id: "vehicle-features-radio",
 *     checked: checked("['vehicle1']['vehicle-features']", "Radio")
 *   }]
 * }) }}
 *
 * @memberof globals
 * @param {string} keyPath Path to key (using dot/bracket notation)
 * @param {string} value Value to check
 * @returns {boolean} Value exists
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
 * Add `name`, `value`, `id`, `idPrefix` and `checked`/`selected` attributes
 * to GOV.UK form inputs. Generates attributes based on where they are stored
 * in the session data object.
 *
 * ### Decorating the `govukDateInput` component
 *
 * `govukDateInput` accepts an optional `items` parameter. If this is not
 * given, day, month and year fields are shown by default, with the `name`
 * value for each item taken from either `params.namePrefix` or one of the
 * default `item.name` values. This creates invalid object paths like
 * `['user']['date-of-birth']-day`, or incorrect name values like `day`.
 *
 * To save authors needing to override each fields individually, we can enable
 * the correct decoration of these inputs via a new `decorate` param. This will
 * pass though any additional options that have been provided in the component.
 *
 * @example <caption>Decorating a text input:</caption>
 * {{ govukInput(decorate({
 *   label: {
 *     text: "Email address"
 *   }
 * }, "account.email")) }}
 *
 * @example <caption>Decorating a date input, with additional options given:</caption>
 * {{ govukDateInput(decorate({
 *   fieldset: {
 *     legend: {
 *       text: "When was your passport issued?"
 *     }
 *   },
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
 * }, "date-of-issue")) }}
 *
 * @param {string} params Component parameters
 * @param {string} keyPath Path to key (using dot/bracket notation)
 * @returns {Object} Updated component parameters
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

      let checked = storedValue ? '' : item.checked
      let selected = storedValue ? '' : item.selected

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
 * @param {Object} errorMap Mapped error response from express-validator
 * @returns {Array} List of errors
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

export const libGlobals = {
  checked,
  decorate,
  errorList
}
