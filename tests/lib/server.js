import http from 'node:http'
import test from 'ava'
import request from 'supertest'
import app from '../../lib/server.js'

test.before(t => {
  t.context.server = http.createServer(app)
})

test.only('Serves an HTML file', async t => {
  const response = await request(t.context.server).get('/')

  t.is(response.type, 'text/html')
  t.is(response.status, 200)
})

test('Serves GOV.UK assets from modules folder', async t => {
  const response = await request(t.context.server).get('/govuk/assets/images/favicon.ico')

  t.is(response.status, 200)
})

test('Serves robots.txt', async t => {
  const response = await request(t.context.server).get('/robots.txt')

  t.is(response.status, 200)
})

test('Adds x-robots-tag header', async t => {
  const response = await request(t.context.server).get('/')

  t.is(response.headers['x-robots-tag'], 'noindex')
})

test('Shows clear session data page', async t => {
  const response = await request(t.context.server).get('/clear-session-data')

  t.is(response.status, 200)
  t.regex(response.text, /Clear session data\?/)
})

test('Shows clear session data confirmation page', async t => {
  const response = await request(t.context.server).post('/clear-session-data')

  t.is(response.status, 200)
  t.regex(response.text, /Session data has been cleared/)
})

test('Shows feature flags page', async t => {
  const response = await request(t.context.server).get('/feature-flags')

  t.is(response.status, 200)
  t.regex(response.text, /Feature flags/)
})

test('Shows feature flags confirmation page', async t => {
  const response = await request(t.context.server).post('/feature-flags')
    .send({
      features: {
        foo: { name: 'Foo', on: 'true' },
        bar: { name: 'Bar', on: 'false' }
      }
    })

  t.is(response.status, 200)
  t.regex(response.text, /Feature flags updated/)
})

test('Shows password page', async t => {
  const response = await request(t.context.server).get('/prototype-password')

  t.is(response.status, 200)
  t.regex(response.text, /This is a prototype used for research/)
})

test('Shows password page with validation error', async t => {
  process.env.NODE_ENV = 'production'
  process.env.PASSWORD = 'test'
  const response = await request(t.context.server).post('/prototype-password')
    .send({ _password: 'incorrect' })

  t.is(response.status, 422)
  t.regex(response.text, /The password is not correct/)
})

test('Redirects authenticated user to previous page', async t => {
  process.env.NODE_ENV = 'production'
  process.env.PASSWORD = 'test'
  const response = await request(t.context.server).post('/prototype-password')
    .send({ _password: 'test' })
    .send({ returnUrl: '/' })

  t.is(response.status, 302)
})

test('Throws error if trying to redirect to an external site', async t => {
  process.env.NODE_ENV = 'production'
  process.env.PASSWORD = 'test'
  const response = await request(t.context.server).post('/prototype-password')
    .send({ _password: 'test' })
    .send({ returnUrl: 'https://gov.uk' })

  t.is(response.status, 500)
  t.regex(response.text, /Return URL must be a page in this prototype/)
})

test('Shows 404 not found page', async t => {
  const response = await request(t.context.server).get('/not-found')

  t.is(response.status, 404)
})

test.after(t => {
  t.context.server.close()
})
