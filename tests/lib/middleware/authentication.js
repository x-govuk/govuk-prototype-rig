import process from 'node:process'
import test from 'ava'
import sinon from 'sinon'
import mockReqRes from 'mock-req-res'
import { authentication } from '../../../lib/middleware/authentication.js'

const { mockRequest, mockResponse } = mockReqRes

test('Doesn’t authenticate password page', (t) => {
  const request = mockRequest({ path: '/prototype-password' })
  const response = mockResponse()
  const next = sinon.spy()

  authentication(request, response, next)

  t.true(next.calledOnce)
})

test('Shows custom error page if password hasn’t been set', (t) => {
  const request = mockRequest({ path: '/' })
  const response = mockResponse()
  const next = sinon.spy()

  authentication(request, response, next)

  t.true(response.status.calledWith(501))
  t.true(response.render.calledWith('no-password-set.njk'))
})

test('Redirects unauthenticated to user to password page', (t) => {
  process.env.PASSWORD = 'test'

  const request = mockRequest({ path: '/' })
  const response = mockResponse()
  const next = sinon.spy()

  authentication(request, response, next)

  t.true(response.redirect.calledOnce)
  t.true(response.redirect.calledWith('https://undefined/prototype-password?returnUrl='))
})

test('Allows authenticated user to continue', (t) => {
  process.env.PASSWORD = 'test'

  const request = mockRequest({
    cookies: {
      authentication: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
    },
    path: '/'
  })
  const response = mockResponse()
  const next = sinon.spy()

  authentication(request, response, next)

  t.true(next.calledOnce)
})
