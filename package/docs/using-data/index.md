---
title: Creating journeys with data
description: Use and display data a user has entered over a few screens.
tags: Getting started
---

The Prototype Rig includes a simple way of saving data entered in forms, as well as displaying the saved data. Data is stored locally on the computer running the prototype and disappears at the end of the session, when the browser window is closed.

## How to use

The rig stores data from inputs using the name attribute of the input.

For example, if you have this input:

```html
<input name="first-name">
```

You can show what the user entered later on like this:

```html
<p>{{ data['first-name'] }}</p>
```

### Showing answers in inputs

If a user goes back to a page where they entered data, they would expect to see the answer they gave.

For a text input:

```html
<input name="first-name" value="{{ data['first-name'] }}">
```

For a radio or checkbox input you need to use the `checked` function:

```html
<input type="radio" name="over-18" value="yes" {{ checked("over-18", "yes") }}>
```

If `data['over-18']` has the value `yes`, the function will return `checked`.

### Ignoring inputs

To prevent an input being stored, use an underscore at the start of the name.

```html
<input name="_secret">
```

### Using data in Nunjucks components

Example using the `checked` function in a checkbox component:

```njk
{{ govukCheckboxes({
  name: "vehicle-features",
  fieldset: {
    legend: {
      text: "Which of these applies to your vehicle?"
    }
  },
  hint: {
    text: "Select all that apply"
  },
  items: [{
    value: "Heated seats",
    text: "Heated seats",
    id: "vehicle-features-heated-seats",
    checked: checked("vehicle-features", "Heated seats")
  }, {
    value: "GPS",
    text: "GPS",
    id: "vehicle-features-gps",
    checked: checked("vehicle-features", "GPS")
  }, {
    value: "Radio",
    text: "Radio",
    id: "vehicle-features-radio",
    checked: checked("vehicle-features", "Radio")
  }]
}) }}
```

### Using data in routes

You can access the data on the server in a route function.

For example for an input with `name="first-name"`:

```js
var firstName = req.session.data['first-name']
```

## Inspecting data

To see what data has been stored in the session, use the `log` function. By default [the base layout](https://github.com/paulrobertlloyd/govuk-prototype-rig/blob/d08e474abef5d107fb467afd7aaa403921fa4bff/app/layouts/base.njk#L92) logs all session data:

```njk
{{ log(data) }}
```

If too much data is being logged, you can inspect only a certain property:

```njk
{{ log(data['first-name']) }}
```

## Clearing data

To clear the data (for example at the end of a user research session) click the ‘Clear session data’ link in the footer.
