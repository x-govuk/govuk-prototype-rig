/* global validate, NodeList */
const forms = document.querySelectorAll('[data-validate]')

/**
 * Check a date is valid.
 *
 * @access private
 * @param {Object} date - Date object
 * @returns {boolean} `true` if date is valid
 */
const _isValidDate = (date) => {
  return date instanceof Date && !isNaN(date)
}

/**
 * Custom conditional validator.
 *
 * @see {@link https://validatejs.org/#custom-validator}
 *
 * @param {string} value - Value entered
 * @param {Object} options - Options passed in the `validate` param
 * @param {string} key - Attribute to validate.
 * @param {Object} attributes - All the attributes
 * @returns {string} Validation message
 */
validate.validators.conditional = function (value, options, key, attributes) {
  const { name } = options.dependentOn
  const dependent = document.querySelector(`[name="${name}"]:checked`)

  if (dependent) {
    if (dependent.value === options.dependentOn.value) {
      return options.message || this.message || 'Required'
    }
  }
}

/**
 * Custom date validator. We only validate the year value.
 *
 * @see {@link https://validatejs.org/#custom-validator}
 *
 * @param {string} value - Value entered
 * @param {Object} options - Options passed in the `validate` param
 * @param {string} key - Attribute to validate.
 * @param {Object} attributes - All the attributes
 * @returns {string} Validation message
 */
validate.validators.date = function (value, options, key, attributes) {
  const year = attributes[key] || ''
  const month = attributes[key.replace('year', 'month')] || ''
  const day = attributes[key.replace('year', 'day')] || ''

  const isoDate = [
    year,
    month.padStart(2, '0'),
    day.padStart(2, '0')
  ].join('-')

  const date = new Date(isoDate)

  if (!_isValidDate(date)) {
    return options.message ? options.message : 'Enter a valid date'
  }
}

function getSubmitHandler (form) {
  return function submitHandler (event) {
    // Don’t submit the form
    event.preventDefault()

    // Remove hidden inputs used to remember unchecked $inputs
    removeHiddenFormElements()

    const validations = document.getElementById('form-validation').innerHTML
    const errors = validate(form, JSON.parse(validations), {
      fullMessages: false
    })

    // If no errors, submit the form
    if (!errors) {
      form.removeEventListener('submit', submitHandler)
      form.submit()
      return
    }

    // Remove previous error messages and summary
    removeErrorSummary()
    for (const element of form.elements) {
      removeErrorMessage(element)
    }

    // Show new error messages and summary
    showErrorSummary(errors)
    for (const name in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, name)) {
        showErrorMessage(form, name, errors[name][0])
      }
    }
  }
}

const nameToId = (name) => {
  return name.replace('][', '-').replace('[', '').replace(']', '')
}

function removeHiddenFormElements () {
  const hiddenElements = document.querySelectorAll('input[value="_unchecked"]')
  hiddenElements.forEach(element => element.parentNode.removeChild(element))
}

function removeErrorMessage (element) {
  element.classList.remove('govuk-input--error')
  element.classList.remove('govuk-select--error')
  element.classList.remove('govuk-textarea--error')

  let formGroup = element.closest('.govuk-form-group')

  if (element.classList.contains('govuk-date-input__input')) {
    // Date inputs are doubly grouped - we want the parent one
    formGroup = formGroup.parentNode.closest('.govuk-form-group')

    // Mark all date inputs in this group as errored, not just the one
    const dateInputs = formGroup.querySelectorAll('.govuk-date-input__input')
    dateInputs.forEach(dateInput => {
      dateInput.classList.remove('govuk-input--error')
    })
  }

  formGroup && formGroup.classList.remove('govuk-form-group--error')
  const errorMessage = element.parentNode.querySelector('.govuk-error-message')
  errorMessage && errorMessage.parentNode.removeChild(errorMessage)
}

function showErrorMessage (form, name, error) {
  const element = Object.prototype.isPrototypeOf.call(NodeList.prototype, form[name]) ? form[name][0] : form[name]

  element.setAttribute('aria-describedby', `${nameToId(name)}-error`)

  switch (true) {
    case element.classList.contains('govuk-input'):
      element.classList.add('govuk-input--error')
      break
    case element.classList.contains('govuk-select'):
      element.classList.add('govuk-select--error')
      break
    case element.classList.contains('govuk-textarea'):
      element.classList.add('govuk-textarea--error')
      break
    default:
  }

  // Get form group
  let formGroup = element.closest('.govuk-form-group')

  // Date inputs are doubly grouped - we want the parent one
  if (element.classList.contains('govuk-date-input__input')) {
    formGroup = formGroup.parentNode.closest('.govuk-form-group')

    // Mark all date inputs in group as errored, not just the year
    const dateInputs = formGroup.querySelectorAll('.govuk-date-input__input')
    dateInputs.forEach(dateInput => dateInput.classList.add('govuk-input--error'))
  }

  // Add error class to form group
  formGroup.classList.add('govuk-form-group--error')

  // Create a new error message
  const template = document.querySelector('#govuk-error-message-template')

  const govukErrorMessage = template.content.cloneNode(true)
  govukErrorMessage.firstElementChild.id = `${nameToId(name)}-error`

  const visuallyHiddenPrefix = govukErrorMessage.querySelector('span')
  visuallyHiddenPrefix.insertAdjacentHTML('afterend', error)

  // Insert error message above the field input
  if (element.classList.contains('govuk-radios__input')) {
    element.closest('.govuk-radios').before(govukErrorMessage)
  } else if (element.classList.contains('govuk-date-input__input')) {
    element.closest('.govuk-date-input').before(govukErrorMessage)
  } else if (element.classList.contains('govuk-checkboxes__input')) {
    element.closest('.govuk-checkboxes').before(govukErrorMessage)
  } else {
    formGroup.insertBefore(govukErrorMessage, form[name])
  }
}

function jumpToError (event, name) {
  event.preventDefault()
  removeHiddenFormElements()

  const targetElement = document.getElementById(nameToId(name))
  let formGroup = targetElement.closest('.govuk-form-group')

  // Date inputs are doubly grouped - we want the parent
  if (targetElement.classList.contains('govuk-date-input__input')) {
    formGroup = formGroup.parentNode.closest('.govuk-form-group')
  }

  // Place focus on the form control
  targetElement.focus()

  // Scroll to the form group (not the field)
  window.scrollTo(0, formGroup.offsetTop)
}

function removeErrorSummary () {
  const previousSummary = document.querySelector('.govuk-error-summary')
  previousSummary && previousSummary.parentNode.removeChild(previousSummary)
}

function showErrorSummary (errors) {
  if (!errors) {
    return
  }

  // Create a new error summary
  const template = document.querySelector('#govuk-error-summary-template')
  const govukErrorSummary = template.content.cloneNode(true)

  // Add links to validation messages to error summary list
  const errorList = govukErrorSummary.querySelector('ul')
  for (const name in errors) {
    if (Object.prototype.hasOwnProperty.call(errors, name)) {
      const errorLink = document.createElement('a')
      errorLink.textContent = errors[name][0]
      errorLink.setAttribute('href', `#${nameToId(name)}`)
      errorLink.addEventListener('click', event => jumpToError(event, name))

      const errorItem = document.createElement('li')
      errorItem.appendChild(errorLink)
      errorList.appendChild(errorItem)
    }
  }

  // Insert error summary at the top of the page
  document.querySelector('main').prepend(govukErrorSummary)

  // Place focus on the error summary
  const newErrorSummary = document.querySelector('.govuk-error-summary')
  new window.GOVUKFrontend.ErrorSummary(newErrorSummary).init()
}

forms.forEach(form => {
  form.addEventListener('submit', getSubmitHandler(form))
})
