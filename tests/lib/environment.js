import process from 'node:process'
import test from 'ava'
import { getEnvBoolean } from '../../lib/environment.js'

process.env.TEST_OPTION_1 = 'TRUE'

test('Gets environment variable as a boolean value', t => {
  t.true(getEnvBoolean('TEST_OPTION_1'))
})

test('Gets environment variable as a boolean value, overriding config', t => {
  t.true(getEnvBoolean('TEST_OPTION_1', { testOption1: false }))
})

test('Defaults to value in config if no environment variable', t => {
  t.false(getEnvBoolean('TEST_OPTION_2', { testOption2: false }))
})
