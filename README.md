# GOV.UK Prototype Rig

Go to the [GOV.UK Prototype Rig](https://govuk-prototype-rig.herokuapp.com) website to download the latest version and read the documentation.

## Requirements

* Node.js v16

## Installation

1. Clone this repository:\
`git clone git@github.com:paulrobertlloyd/govuk-prototype-rig.git`

2. Install the dependencies:\
`npm install`

3. Start the application:\
`npm start`

You can change the service name by changing the `prototype.serviceName` value in `package.json`.

By default, the rig expects templates to use the `.html` file extension. You can change this by setting the `prototype.templateExtension` value in `package.json`.

## Developing locally

To automatically refresh the browser upon updating a file, use `npm run dev`.

To lint JavaScript and CSS files, use `npm run lint`.

## Contributing

If you’ve got an idea or suggestion, please [create a GitHub issue](https://github.com/paulrobertlloyd/govuk-prototype-rig/issues).
