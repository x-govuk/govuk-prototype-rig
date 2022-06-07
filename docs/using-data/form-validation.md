---
templateEngineOverride: md
order: 2
title: Form validation
description: The validation helper makes it easy to show error messages when users are completing forms.
---

The rig incorporates [validatejs.org](https://validatejs.org) to provide client-side validation of form fields[^1].

You can validate forms by adding [validators](https://validatejs.org/#validators) to components using the `validation` option. For example, you could add the [`presence` validator](https://validatejs.org/#validators-presence) to a text input and provide [an error message to show](https://design-system.service.gov.uk/components/text-input/#error-messages) if it’s empty:

```njk
{{ govukInput({
  label: {
    text: "Full name"
  },
  decorate: "full-name",
  validate: {
    presence: {
      message: "Enter your full name"
    }
  }
}) }}
```

If a form is submitted and this input is empty, the error message will be shown above the input, and in an [error summary](https://design-system.service.gov.uk/components/error-summary/) shown at the top of the page.

## Validating dates

To validate dates entered into a [date input](https://design-system.service.gov.uk/components/date-input/) the rig provides a `date` validator. This can be used alongside other validators such as the [`presence` validator](https://validatejs.org/#validators-presence).

> This validator does not provide the [complete validation and error messaging that the GOV.UK Design System recommends](https://design-system.service.gov.uk/components/date-input/#error-messages), but should be enough for your prototypes.

The following input will show an error message if no date is entered or, for example, the month value is not between 1 and 12:

```njk
{{ govukDateInput({
  fieldset: {
    legend: {
      text: "When was your passport issued?"
    }
  },
  hint: {
    text: "For example, 12 11 2007"
  },
  items: [{
    decorate: "day"
  }, {
    decorate: "month"
  }, {
    decorate: "year"
  }],
  decorate: "passport-issued",
  validate: {
    presence: {
      message: "Enter the date your passport was issued"
    },
    date: {
      message: "Passport issued should be a valid date"
    }
  }
})) }}
```

## Validating conditional inputs

To validate inputs in conditional options in [checkboxes](https://design-system.service.gov.uk/components/checkboxes/) and [radios](https://design-system.service.gov.uk/components/radios/) the rig provides a `conditional` validator.

Say you have a question with 2 options for how a user would like to be contacted.

The `presence` validator can show the message ‘Select a contact method’ if neither option is selected.

If an option is selected, but its conditional input is empty, the `conditional` validator lets you show a message for that input.

The `conditional` validator takes 3 options:

* `dependentOn.name` is the name of the checkbox or radio group
* `dependentOn.value` is the value of the option in which the conditional input is provided
* `message` is the error message to show if the input is empty

For example:

```njk
{{ govukRadios({
  fieldset: {
    legend: {
      classes: "govuk-fieldset__legend--s",
      text: "How would you prefer to be contacted?"
    }
  },
  hint: {
    text: "Select one option"
  },
  items: [{
    value: "email",
    text: "Email",
    conditional: {
      html: govukInput({
        classes: "govuk-!-width-one-third",
        label: {
          text: "Email address"
        },
        type: "email",
        spellcheck: "false",
        decorate: "email-address",
        validate: {
          conditional: {
            dependentOn: {
              name: "[contact-method]",
              value: "email"
            },
            message: "Enter your email address"
          }
        }
      })
    }
  }, {
    value: "phone",
    text: "Phone",
    conditional: {
      html: govukInput({
        classes: "govuk-!-width-one-third",
        label: {
          text: "Phone number"
        },
        type: "tel",
        decorate: "phone-number",
        validate: {
          conditional: {
            dependentOn: {
              name: "[contact-method]",
              value: "phone"
            },
            message: "Enter your phone number"
          }
        }
      })
    }
  }],
  decorate: "contact-method",
  validate: {
    presence: {
      message: "Select a contact method"
    }
  }
}) }}
```

[^1]: This feature is based on [GOV.UK Prototype Kit with form validation](https://github.com/LandRegistry/govuk-prototype-kit-form-validation), built by the team at HM Land Registry.
