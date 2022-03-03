# GOV.UK Prototype Components

GOV.UK Prototype Components contains the code you need to use common or experimental components that are not yet in the GOV.UK Design System.

| Component | Description |
| - | - |
| [`xGovukAutocomplete`](x-govuk/components/autocomplete/README.md) | Implements the [Accessible autocomplete pattern](https://github.com/alphagov/accessible-autocomplete) to enhance a fixed list of options provided by a `<select>` element. |
| [`xGovukMasthead`](x-govuk/components/masthead/README.md) | Implements the masthead component [used on many GOV.UK product pages](https://github.com/alphagov/product-page-example). |
| [`xGovukRelatedNavigation`](x-govuk/components/related-navigation/README.md) | Implements [related navigation component](https://components.publishing.service.gov.uk/component-guide/related_navigation) found in the `govuk_publishing_components`  gem. |
| `xGovukSideNavigation` | Implements the side navigation component used on the GOV.UK Design System website. |
| [`xGovukSummaryCard`](x-govuk/components/summary-card/README.md) | Implements a component [proposed for inclusion in the GOV.UK Design System](https://github.com/alphagov/govuk-design-system-backlog/issues/210). |
| [`xGovukTaskList`](x-govuk/components/task-list/README.md) | Implements the [task list page pattern documented on the GOV.UK Design System](https://design-system.service.gov.uk/patterns/task-list-pages/). |

These components are currently experimental and more research is needed to validate them.

Versions of each form component available in GOV.UK Frontend are also provided. These allow you to [replace the multiple parameters needed for saving data with a single `decorate` parameter](https://govuk-prototype-rig.herokuapp.com/docs/using-data/form-components).

## Requirements

Node.js v16 or later.

## Installation

`npm install govuk-prototype-components --save`

## Usage

### CSS

#### Import all the CSS

To import all the Sass rules from GOV.UK Prototype Components, add the following to your Sass file:

```scss
@import "govuk-prototype-components/x-govuk/all";
```

#### Import an individual component’s CSS using a single import

You can also import a component and all its dependencies without importing `node_modules/govuk-prototype-components/x-govuk/all` first.

To import the masthead component for example, add the following to your Sass file:

```scss
@import "node_modules/govuk-prototype-components/x-govuk/components/masthead/masthead";
```

### JavaScript

To import the JavaScript for the GOV.UK Prototype Components, you can either:

* add the GOV.UK Prototype Components JavaScript file to your HTML
* import the JavaScript using a bundler like [Webpack](https://webpack.js.org/)

#### Add the JavaScript file to your HTML

If you decide to add the JavaScript to your HTML, first either:

* set up your routing so that requests for the JavaScript file are served from `node_modules/govuk-prototype-components/x-govuk/all.js`
* copy the `node_modules/govuk-prototype-components/x-govuk/all.js` file into your application

Then import the JavaScript file before the closing `</body>` tag of your HTML page or page template, and run the `initAll` function to initialise all the components.

```html
<body>
  ...
  <script src="<YOUR-APP>/<YOUR-JS-FILE>.js"></script>
  <script>
    window.GOVUKPrototypeComponents.initAll()
  </script>
</body>
```

#### Import JavaScript using a bundler

If you decide to import using a bundler, use `import` to import all GOV.UK Prototype Components, then run the `initAll` function to initialise them:

```js
import { initAll } from 'govuk-prototype-components'
initAll()
```

If you’re using a bundler that uses CommonJS like [Browserify](http://browserify.org/), you should use `require`:

```js
const GOVUKPrototypeComponents = require('govuk-prototype-components')
GOVUKPrototypeComponents.initAll()
```

### Nunjucks

#### Import experimental component macros

Import the component macros as you would those provided by GOV.UK Frontend:

```njk
{% from "x-govuk/components/autocomplete/macro.njk" import xGovukAutocomplete with context %}
{% from "x-govuk/components/masthead/macro.njk" import xGovukMasthead %}
{% from "x-govuk/components/related-navigation/macro.njk" import xGovukRelatedNavigation %}
{% from "x-govuk/components/side-navigation/macro.njk" import xGovukSideNavigation %}
{% from "x-govuk/components/summary-card/macro.njk" import xGovukSummaryCard %}
{% from "x-govuk/components/task-list/macro.njk" import xGovukTaskList %}
```

#### Use the decorated form component macros

1. Replace GOV.UK Frontend macro imports with those provided by this package:

    ```diff
    - {% from "govuk/components/checkboxes/macro.njk" import govukCheckboxes %}
    + {% from "x-govuk/components/decorated/checkboxes/macro.njk" import govukCheckboxes with context %}
    - {% from "govuk/components/date-input/macro.njk" import govukDateInput %}
    + {% from "x-govuk/components/decorated/date-input/macro.njk" import govukDateInput with context %}
    - {% from "govuk/components/file-upload/macro.njk" import govukFileUpload %}
    + {% from "x-govuk/components/decorated/file-upload/macro.njk" import govukFileUpload with context %}
    - {% from "govuk/components/input/macro.njk" import govukInput %}
    + {% from "x-govuk/components/decorated/input/macro.njk" import govukInput with context %}
    - {% from "govuk/components/radios/macro.njk" import govukRadios %}
    + {% from "x-govuk/components/decorated/radios/macro.njk" import govukRadios with context %}
    - {% from "govuk/components/select/macro.njk" import govukSelect %}
    + {% from "x-govuk/components/decorated/select/macro.njk" import govukSelect with context %}
    - {% from "govuk/components/textarea/macro.njk" import govukTextarea %}
    + {% from "x-govuk/components/decorated/textarea/macro.njk" import govukTextarea with context %}
    ```

2. Add the `decorate` global function to your Nunjucks environment:

    ```js
    const decorate = require('govuk-prototype-components/decorate')
    const express = require('express')
    const nunjucks = require('nunjucks')

    const app = express();

    const env = nunjucks.configure('views', {
      autoescape: true,
      express: app
    });

    env.addGlobal('decorate', decorate)
    ```
