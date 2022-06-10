import test from 'ava'
import {
  govukMarkdown,
  isString,
  noOrphans,
  pluralise,
  slugify,
  startsWith
} from '../../../lib/filters/string.js'

test('Converts a Markdown formatted string to HTML', t => {
  t.is(govukMarkdown('**this** is _emphasis_'), '<p class="govuk-body"><strong>this</strong> is <em>emphasis</em></p>\n')
})

test('Check if a value is classified as a `String`', t => {
  t.true(isString('Number 10'))
  t.false(isString(10))
})

test('Gets the plural form for an item for a given number of items', t => {
  t.is(pluralise(1, 'mouse'), '1 mouse')
  t.is(pluralise(2, 'house'), '2 houses')
  t.is(pluralise(2, 'house', { number: false }), 'houses')
  t.is(pluralise(2, 'mouse', { plural: 'mice' }), '2 mice')
  t.is(pluralise(2, 'mouse', { plural: 'mice', number: false }), 'mice')
})

test('Inserts non-breaking space between the last two words of a string', t => {
  t.is(noOrphans('Department for Education'), 'Department for&nbsp;Education')
  t.is(noOrphans('Government'), 'Government')
})

test('Converts a string to kebab-case', t => {
  t.is(slugify('Department for Education'), 'department-for-education')
})

test('Checks if a string starts with a value', t => {
  t.true(startsWith('Department of Transport', 'Department'))
})
