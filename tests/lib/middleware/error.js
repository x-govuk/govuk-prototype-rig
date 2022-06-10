import test from 'ava'
import sinon from 'sinon'
import mockReqRes from 'mock-req-res'
import {
  notFoundError,
  internalServerError
} from '../../../lib/middleware/error.js'

const { mockRequest, mockResponse } = mockReqRes

test('Returns 404 for page not found', (t) => {
  const request = mockRequest()
  const response = mockResponse()
  const next = sinon.spy()

  notFoundError(request, response, next)

  t.true(response.status.calledWith(404))
  t.true(response.render.calledOnceWith('404.njk'))
})

test('Returns 500 for unknown error', (t) => {
  const unknownError = new Error('Unknown')
  const request = mockRequest()
  const response = mockResponse()
  const next = sinon.spy()

  internalServerError(unknownError, request, response, next)

  t.true(response.status.calledWith(500))
  t.true(response.render.calledOnceWith('500.njk'))
})
