import _ from 'lodash'

/**
 * Add `name`, `value`, `id`, `idPrefix` and `checked`/`selected` attributes
 * to GOV.UK form inputs. Generates attributes based on where they are stored
 * in the session data object.
 *
 * @param {string} params - Component parameters
 * @param {string} keyPath - Path to key (using dot/bracket notation)
 * @param {string} [componentName] - Name of component calling decorate
 * @returns {Object} Updated component parameters
 */
export function decorate (params, keyPath, componentName) {
  if (typeof keyPath === 'undefined') {
    return params
  }

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

  // Add field validations to session data
  if (params.validate) {
    data.validations = data.validations || {}
    data.validations[params.name] = params.validate
  }

  if (componentName === 'govukDateInput' && !params.items) {
    params.items = [
      { decorate: 'day' },
      { decorate: 'month' },
      { decorate: 'year' }
    ]
  }

  if (params.items) {
    params.idPrefix = params.id
    params.items = params.items.map(item => {
      // Ignore dividers or empty items
      if (item.divider || item === '') {
        return item
      }

      // Validating dates
      // ================
      // We want to validate a combined date, but validate.js validates
      // individual fields. The custom `date` validator hooks into the year
      // value and gets day and month values via its `attributes` object.
      //
      // 1. Delete `validations` for all date fields
      // 2. Add `validations` for year field

      if (item.decorate && data.validations) {
        delete data.validations[params.name] // 1.
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

          if (params.validate && data.validations) {
            data.validations[item.name] = params.validate // 2.
          }

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
    // Check for undefined because value may exist and be intentionally blank
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
