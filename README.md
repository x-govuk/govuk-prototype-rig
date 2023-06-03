# GOV.UK Prototype Rig

Rapidly create prototypes of GOV.UK services.

> **Note** This project has been retired.
>
> The GOV.UK Prototype Rig was a re-imagined version of the GOV.UK Prototype Kit. It added new features like filters and feature flags, and dropped compatibility with IE8 and GOV.UK Elements.
>
> This made sense while the Prototype Kit wasn’t actively developed, but that situation later changed. Many of the features of this project were added to the Prototype Kit, alongside a plugin system that made it easier for the community to add new features using that functionality.

## Requirements

* Node.js v18

## Installation

1. Clone this repository:\
`git clone git@github.com:x-govuk/govuk-prototype-rig.git`

2. Install the dependencies:\
`npm install`

3. Start the application:\
`npm start`

You can change the service name by changing the `prototype.serviceName` value in `package.json`.

By default, the rig expects templates to use the `.html` file extension. You can change this by setting the `prototype.templateExtension` value in `package.json`.

## Developing locally

To automatically refresh the browser upon updating a file, use `npm run dev`.

To lint JavaScript and CSS files, use `npm run lint`.
