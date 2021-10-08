# GOV.UK Prototype Rig

The Prototype Rig is a minimal and opinionated version of the [GOV.UK Prototype Kit](https://govuk-prototype-kit.herokuapp.com/docs). It is designed to be used by developers familiar with the Nunjucks templating language.

It drops support for legacy frameworks and undocumented features, and updates the underlying tooling. It also includes Nunjucks helpers that are useful when creating pages and flows.

## Differences from the Prototype Kit

The following features have been removed:

* Support for [GOV.UK elements](https://govuk-elements.herokuapp.com/) (superseded by the [GOV.UK Design System](https://design-system.service.gov.uk) in 2018)
* Bundled documentation
* Extensions (an undocumented feature of the Prototype Kit)
* Unbranded template
* Usage data collection
* A stylesheet for Internet Explorer 8
* jQuery
* Gulp

What this project takes away with one hand, it gives with another:

* `.editorconfig`
* Tasks run via [npm scripts](https://docs.npmjs.com/cli/v7/using-npm/scripts)
* CSS linting using [Stylelint](https://stylelint.io)
* Sass compiled using [the Dart library](https://sass-lang.com/dart-sass)
* Assets compiled and bundled using [rollup.js](https://rollupjs.org/)
* Clearer organisation of files and folders
* Rewritten using ES modules
* 404 page
* Display of session data in the console
* Support for form validation
* A set of Nunjucks component macros, filters and helpers

## Nunjucks helpers

### Component macros

The following nunjucks macros are provided for common components not currently in the GOV.UK Design System:

* [Related navigation](/app/components/related-navigation/README.md)
* [Summary card](/app/components/summary-card/README.md)
* [Task list](/app/components/task-list/README.md)

### Global helpers

* `checked()`: Checks if a given value exists in session data
* `decorate()`: Adds `name`, `value`, `id`/`idPrefix` and `checked`/`selected` and `errorMessage` attributes to GOV.UK inputs
* `errorList()`: Transforms errors provided by [Express Validator](https://express-validator.github.io) into an array that can be consumed by the error summary component

### Filters

* `log`: Logs data to the console

## Requirements

* Node.js v16

## Installation

1. Clone this repository:\
`git clone git@github.com:paulrobertlloyd/govuk-prototype-rig.git`

2. Install the dependencies:\
`npm install`

3. Start the application:\
`npm start`

You can change the service name by changing the `name` value in `app.json`.

## Developing locally

To automatically refresh the browser upon updating a file, use `npm run dev`.

To lint JavaScript and CSS files, use `npm run lint`.

## Contributing

If you’ve got an idea or suggestion, please [create a GitHub issue](https://github.com/paulrobertlloyd/govuk-prototype-rig/issues).
