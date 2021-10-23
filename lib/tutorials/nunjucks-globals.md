Several global helpers available for use in Nunjucks templates.

## checked

Check if a property value exists. Note: You do not need to use this helper if you are using the `decorate` helper.

**Session data**

```js
{
  'changed-name': 'no'
}
```

**Input**

```njk
{{ govukRadios({
  idPrefix: "changed-name",
  name: "changed-name",
  fieldset: {
    legend: {
      text: "Have you changed your name?"
    }
  },
  items: [{
    value: "yes",
    text: "Yes",
    checked: checked("changed-name", "yes")
  }, {
    value: "no",
    text: "No",
    checked: checked("changed-name", "no")
  }]
}) }}
```

**Output**

```html
<div class="govuk-form-group">
  <fieldset class="govuk-fieldset">
    <legend class="govuk-fieldset__legend">
      Have you changed your name?
    </legend>
    <div class="govuk-radios">
      <div class="govuk-radios__item">
        <input class="govuk-radios__input" id="changed-name" name="changed-name" type="radio" value="yes">
        <label class="govuk-label govuk-radios__label" for="changed-name">Yes</label>
      </div>
      <div class="govuk-radios__item">
        <!-- The checked attribute has been added to this input -->
        <input class="govuk-radios__input" id="changed-name-2" name="changed-name" type="radio" value="no" checked>
        <label class="govuk-label govuk-radios__label" for="changed-name-2">No</label>
      </div>
    </div>
  </fieldset>
</div>
```

## decorate

Add `name`, `value`, `id`, `idPrefix` and `checked`/`selected` attributes to GOV.UK form inputs. Generates attributes based on where they are stored in the session data object.

**Session data**

```js
{
  account: {
    email: 'jane.doe@example.com'
  }
}
```

**Input**

```njk
{{ govukInput(decorate({
  label: {
    text: "Email address"
  }
}, "account.email")) }}
```

**Output**

```html
<div class="govuk-form-group">
  <label class="govuk-label" for="account-email">Email address</label>
  <input class="govuk-input" id="account-email" name="[account][email]" type="text" value="jane.doe@example.com">
</div>
```

### Decorating a date input

`govukDateInput` accepts an optional `items` parameter. If this is not given, day, month and year fields are shown by default, with the `name` value for each item taken from either `params.namePrefix` or one of the default `item.name` values. This creates invalid object paths like `['user']['date-of-birth']-day`, or incorrect name values like `day`.

To save authors needing to override each fields individually, we can enable the correct decoration of these inputs via a new `decorate` param. This will pass though any additional options that have been provided in the component.

```njk
{{ govukDateInput(decorate({
  fieldset: {
    legend: {
      text: "When was your passport issued?"
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
  }]
}, "date-of-issue")) }}
```

## errorMap

Transform errors provided by [Express Validator](https://express-validator.github.io) into an array that can be consumed by the error summary component.

If a field has multiple errors, return only the first error.
