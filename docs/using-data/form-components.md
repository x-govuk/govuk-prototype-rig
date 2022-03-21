---
templateEngineOverride: md
title: Using form components
description: The decorate helper makes it easy to build forms to collect data.
---

With session data, you can build complex, data-driven transactions. Yet adding different values to form components can be repetitive, especially if you are using nested values.

To collect a user’s email address, you would normally write:

```njk
{{ govukInput({
  label: {
    text: "Email address"
  },
  id: "email-address",
  name: "account['email-address']"
  value: data.account['email-address']
}) }}
```

3 separate parameters are needed to store and display data. Each uses the same value, but formatted in a slightly different way:

* `id`, which uses kebab case
* `name`, which uses object notation
* `value`, which also uses object notation, but proceeded by `data.`

Radios, checkboxes and select components also need to add a `checked` or `selected` attribute to any option that matches the stored value, and date inputs need individual values for day, month and year fields.

## Decorating forms

The `decorate` attribute removes this overhead. It adds `name`, `value`, `id` (or `idPrefix`) and `checked`/`selected` attributes to a GOV.UK form component, with values based on where the data is stored.

The above example can be rewritten as:

```njk
{{ govukInput({
  label: {
    text: "Email address"
  },
  decorate: "account.email-address"
}) }}
```

This would generate the following HTML:

```html
<div class="govuk-form-group">
  <label class="govuk-label" for="account-email-address">Email address</label>
  <input class="govuk-input" id="account-email-address" name="[account][email-address]" type="text" value="jane.doe@example.com">
</div>
```

### Date inputs

[The date input component](https://design-system.service.gov.uk/components/date-input/) accepts an optional `items` parameter.

If no value is given, day, month and year fields are shown by default. This works with the decorate attribute too:

```njk
{{ govukDateInput({
  fieldset: {
    legend: {
      text: "When was your passport issued?"
    }
  },
  decorate: "date-of-issue"
}) }}
```

If you need custom attributes on the day, month or year inputs you need to use a `decorate` param for each field:

```njk
{{ govukDateInput({
  fieldset: {
    legend: {
      text: "What is your date of birth?"
    }
  },
  items: [{
    decorate: "day",
    autocomplete: "bday-day"
  }, {
    decorate: "month",
    autocomplete: "bday-month"
  }, {
    decorate: "year",
    autocomplete: "bday-year"
  }],
  decorate: "date-of-birth"
}) }}
```
