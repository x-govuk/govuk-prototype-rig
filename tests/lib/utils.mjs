import test from 'ava'
import { normalize } from '../../lib/utils.js'

test('Normalises value provided to a filter', t => {
  t.is(normalize('Dollars', 'Pounds'), 'Dollars')
  t.is(normalize(undefined, 'Pounds'), 'Pounds')
})
