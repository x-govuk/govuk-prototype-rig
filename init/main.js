#!/usr/bin/env node
import fs from 'node:fs'
import create from 'base-create'
import chalk from 'chalk'
import cpy from 'cpy'
import prompts from 'prompts'
import { copyFile } from './utils/copy-file.js'
import { createReadme } from './utils/create-readme.js'

const packagePath = new URL('./package.json', import.meta.url)
const { bugs, name, version } = JSON.parse(fs.readFileSync(packagePath))

export async function main () {
  const { log } = console

  log(`\n${chalk.bold('Welcome to GOV.UK Prototype Rig')} ${chalk.white(`(${name} v${version})`)}`)
  log(`If you encounter a problem, visit ${chalk.cyan(`${bugs.url}`)} to search or file a new issue.\n`)

  log(`${chalk.green('>')} ${chalk.white('Gathering details…')}`)

  const response = await prompts([{
    type: 'text',
    name: 'serviceName',
    message: 'What is the name of your service?'
  }, {
    type: 'toggle',
    name: 'includeExamples',
    message: 'Do you want to include example layouts in your project?',
    initial: true,
    active: 'Yes',
    inactive: 'No'
  }])

  let { serviceName, includeExamples } = response

  if (!serviceName) {
    serviceName = 'Your service name'
  }

  const nodeVersion = 16

  const newPackage = create({
    dependencies: [
      '@rollup/plugin-commonjs',
      '@rollup/plugin-node-resolve',
      'govuk-prototype-rig',
      'npm-run-all',
      'rollup',
      'rollup-plugin-copy',
      'rollup-plugin-scss',
      'sass'
    ],
    devDependencies: [
      'standard',
      'stylelint',
      'stylelint-config-gds'
    ],
    package: {
      description: `Prototype for the ‘${serviceName}’ service`,
      version: '0.1.0',
      keywords: ['prototype'],
      license: 'MIT',
      engines: {
        node: nodeVersion.toString()
      },
      type: 'module',
      prototype: {
        serviceName
      },
      stylelint: {
        extends: 'stylelint-config-gds/scss'
      },
      scripts: {
        'build-assets': 'rollup --config --silent',
        'watch-assets': 'rollup --config --silent --watch',
        serve: 'govuk-prototype-rig',
        start: 'npm-run-all --serial build-assets serve',
        dev: 'npm-run-all --parallel watch-assets serve',
        lint: 'standard && stylelint \'app/**/*.scss\''
      }
    },
    files: [{
      path: 'README.md',
      contents: createReadme(serviceName, nodeVersion)
    }, {
      path: '.gitignore',
      contents: '.DS_Store\n.env\n.port.tmp\n.sass-cache\n.start.pid\n.tmuxp.*\n\nnode_modules\npublic'
    }, {
      path: '.nvmrc',
      contents: nodeVersion
    }],
    skipGitignore: true
  })

  const filesDir = './node_modules/create-govuk-prototype-rig/files'
  const destDir = newPackage.name

  cpy(`${filesDir}/app/**`, `${destDir}/app`)
  copyFile(`${filesDir}/rollup.config.js`, `${destDir}/rollup.config.js`)

  if (includeExamples) {
    cpy(`${filesDir}/examples/views/**`, `${destDir}/app/views`)
    copyFile(`${filesDir}/examples/routes.js`, `${destDir}/app/routes.js`)
    copyFile(`${filesDir}/examples/wizards.js`, `${destDir}/app/wizards.js`)
  }
}
