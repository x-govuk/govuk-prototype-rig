import test from 'ava'
import nunjucks from 'nunjucks'
import {
  checked
} from '../../../lib/globals/checked.js'

test.before(t => {
  const views = [
    './',
    './node_modules/govuk-frontend',
    './tests/fixtures'
  ]
  const env = nunjucks.configure(views)
  env.addGlobal('checked', checked)

  t.context.nunjucks = env
})

test('Checks input if a property value exists', t => {
  const result = t.context.nunjucks.render('radios.njk', {
    data: { country: 'england' }
  })

  t.regex(result, /name="country".*value="england".*checked/)
})

test('Checks input if a property value exists in array', t => {
  const result = t.context.nunjucks.render('checkboxes.njk', {
    data: { nationality: ['british', 'irish'] }
  })

  t.regex(result, /name="nationality".*value="british".*checked/)
  t.regex(result, /name="nationality".*value="irish".*checked/)
  t.regex(result, /name="nationality".*value="other">/)
})

test('Doesn’t check input if no context data', t => {
  const result = t.context.nunjucks.render('checkboxes.njk', {})

  t.regex(result, /name="nationality".*value="british">/)
  t.regex(result, /name="nationality".*value="irish">/)
})

test('Doesn’t check input if no values found', t => {
  const result = t.context.nunjucks.render('radios.njk', {
    data: { foo: 'bar' }
  })

  t.regex(result, /name="country".*value="england">/)
  t.regex(result, /name="country".*value="wales">/)
  t.regex(result, /name="country".*value="scotland">/)
  t.regex(result, /name="country".*value="northern-ireland">/)
})
