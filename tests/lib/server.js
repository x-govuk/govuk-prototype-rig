import test from 'ava'
import request from 'supertest'
import app from '../../lib/server.js'

test('Serves an HTML files', async t => {
  const response = await request(app).get('/')

  t.is(response.type, 'text/html')
  t.is(response.status, 200)
})

test('Serves GOV.UK assets from modules folder', async t => {
  const response = await request(app).get('/govuk/assets/images/favicon.ico')

  t.is(response.status, 200)
})

test('Serves robots.txt', async t => {
  const response = await request(app).get('/robots.txt')

  t.is(response.status, 200)
})

test('Adds x-robots-tag header', async t => {
  const response = await request(app).get('/')

  t.is(response.headers['x-robots-tag'], 'noindex')
})

test('Shows clear session data page', async t => {
  const response = await request(app).get('/clear-session-data')

  t.is(response.status, 200)
  t.regex(response.text, /Clear session data\?/)
})

test('Shows clear session data confirmation page', async t => {
  const response = await request(app).post('/clear-session-data')

  t.is(response.status, 200)
  t.regex(response.text, /Session data has been cleared/)
})

test('Shows feature flags page', async t => {
  const response = await request(app).get('/feature-flags')

  t.is(response.status, 200)
  t.regex(response.text, /Feature flags/)
})

test('Shows feature flags confirmation page', async t => {
  const response = await request(app).post('/feature-flags')
    .send({
      features: {
        foo: {
          name: 'Foo',
          on: 'true'
        },
        bar: {
          name: 'Bar',
          on: 'false'
        }
      }
    })

  t.is(response.status, 200)
  t.regex(response.text, /Feature flags updated/)
})

test('Shows 404 not found page', async t => {
  const response = await request(app).get('/not-found')

  t.is(response.status, 404)
})
