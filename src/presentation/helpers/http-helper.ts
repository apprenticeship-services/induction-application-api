import { ServerError } from '../errors/server-error'
import { UnauthorizedError } from '../errors/unauthorized'
import { HttpResponse } from '../protocols'

export const badRequest = (e: Error): HttpResponse => ({
  statusCode: 400,
  body: e
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 400,
  body: new UnauthorizedError()
})

export const forbidden = (e: Error): HttpResponse => ({
  statusCode: 403,
  body: e
})

export const serverError = (e: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(e.stack)
})

export const noContent = ():HttpResponse => ({
  statusCode: 204,
  body: null
})
