import test from 'ava'
import sinon from 'sinon'
import mockReqRes from 'mock-req-res'
import { forceHttps } from '../../../lib/middleware/force-https.js'

const { mockRequest, mockResponse } = mockReqRes

test('Forces HTTPS', (t) => {
  const request = mockRequest({
    headers: { 'x-forwarded-proto': 'http' },
    connection: {}
  })
  const response = mockResponse()
  const next = sinon.spy()

  forceHttps(request, response, next)

  t.true(response.redirect.calledWith(302))
})

test('Forces HTTPS for prototype on Glitch.com', (t) => {
  const request = mockRequest({
    headers: { 'x-forwarded-proto': 'http, foo' },
    connection: {}
  })
  const response = mockResponse()
  const next = sinon.spy()

  forceHttps(request, response, next)

  t.true(response.redirect.calledWith(302))
})

test('Doesn’t forces HTTPS if already using that protocol', (t) => {
  const request = mockRequest({
    connection: {}
  })
  const response = mockResponse()
  const next = sinon.spy()

  forceHttps(request, response, next)

  t.true(next.calledOnce)
})
