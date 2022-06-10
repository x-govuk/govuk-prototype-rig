import test from 'ava'
import {
  formatList,
  isArray,
  rejectFromArray,
  selectFromArray
} from '../../../lib/filters/array.js'

test.before(t => {
  t.context.array = [
    { name: 'Sally Smith', role: 'admin' },
    { name: 'David Jones', role: 'user' }
  ]
})

test('Converts array to a list formatted as a sentence', t => {
  t.is(
    formatList(['England', 'Scotland', 'Wales']),
    'England, Scotland and Wales'
  )
  t.is(
    formatList(['England', 'Scotland', 'Wales'], 'disjunction'),
    'England, Scotland or Wales'
  )
})

test('Check if a value is the language type of `Object`', t => {
  t.true(isArray(['england', 'scotland', 'wales']))
  t.false(isArray('great britain'))
})

test('Rejects items in an array that have a key with a given value', t => {
  t.deepEqual(rejectFromArray(t.context.array, 'role', 'admin'), [{
    name: 'David Jones',
    role: 'user'
  }])
})

test('Selects items in an array that have a key with a given value', t => {
  t.deepEqual(selectFromArray(t.context.array, 'role', 'admin'), [{
    name: 'Sally Smith',
    role: 'admin'
  }])
})
