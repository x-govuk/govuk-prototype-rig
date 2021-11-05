---
title: About
description: The GOV.UK Prototype Rig provides all you need to build interactive prototypes that look like pages on GOV.UK. These can be used to show ideas to people you work with, and during user research.
---

## Differences from the Prototype Kit

The rig is a re-imagined version of the [GOV.UK Prototype Kit](https://govuk-prototype-kit.herokuapp.com/docs) aimed at developers familiar with the Nunjucks template language.

The Prototype Rig works in exactly the same way as the kit. It stores data in the session, uses [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend) components, and supports hosting prototypes on services like [Heroku](https://www.heroku.com).

Unlike the Prototype Kit, the rig doesn’t provide support for [GOV.UK elements](https://govuk-elements.herokuapp.com/) (superseded by the [GOV.UK Design System](https://design-system.service.gov.uk/) in 2018) or the kit’s extensions feature.

Unbranded templates, jQuery and stylesheets for Internet Explorer 8 are also not included, but can be added if required.

## Features

* 404 and 500 error pages
* [Feature flags](feature-flags.md)
* Session data output to the JavaScript console
* Ability to use `async` functions for session daa
* Support for form validation
* Form [component helper](using-data/form-components.md)
* Nunjucks [template filters](filters/index.md)
* Common [components](components/index.md) not currently in the GOV.UK Design System
* A [wizard helper](using-data/wizard.md) to help create user journeys with branching logic
* Full documentation

The underlying tooling has also been updated:

* Rewritten using ES modules
* Tasks run using [npm scripts](https://docs.npmjs.com/cli/v7/using-npm/scripts)
* CSS linting using [Stylelint](https://stylelint.io)
* Sass compiled using [the Dart library](https://sass-lang.com/dart-sass)
* Assets compiled and bundled using [rollup.js](https://rollupjs.org/)

All code is documented using [JSDoc](https://jsdoc.app).

## Privacy

You must protect user privacy at all times, even when using prototypes. Prototypes made with the rig look like GOV.UK, but do not have the same security provisions. Always make sure you are handling user data appropriately.

## The rig is not a production framework

Things made with the rig may look like GOV.UK, but do not have production code and likely aren’t fully accessible. Don’t use the rig as a base for a production service.
