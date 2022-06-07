---
layout: side-navigation
order: 2
title: Configuration
description: The rig has a number of options that allow you to customise the behaviour of your prototype.
---

The rig uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) to find and load a configuration file. Starting from the current working directory, it looks for the following possible sources:

* a `prototype` property in `package.json`
* a `.prototyperc` file
* a `prototype.config.js` file exporting a JavaScript object
* a `prototype.config.cjs` file exporting a JavaScript object (if you have `"type": "module"` set in `package.json`)

The search stops when one of these is found. You can use the `--config` CLI option to short-circuit this search.

The `.prototyperc` file (without extension) can be in JSON or YAML format. Add a filename extension to help your text editor provide syntax checking and highlighting:

* `.prototyperc.json`
* `.prototyperc.yaml` / `.prototyperc.yml`
* `.prototyperc.js`

## Options

The following options can be set in your configuration file:

| Name | Type | Description |
| :--- | :--- | :---------- |
| **serviceName** | string | The name of your service. Default is `'Your service name'`. |
| **templateExtension** | string | The file extension used for your templates. Default is `'html'`. |
| **useAuth** | boolean | Enable or disable password protection on production. Default is `true`. |
| **useAutoStoreData** | boolean | Automatically store form data and send to all views. Default is `true`. |
| **useCookieSessionStore** | boolean | Enable cookie-based session store (persists on restart). Please note 4KB cookie limit per domain, cookies too large will silently be ignored. Default is `false`. |
| **useHttps** | boolean | Force HTTP to redirect to HTTPS on production. Default is `true`. |
