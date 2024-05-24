import { ServerError } from '../errors/server-error'
import { UnauthorizedError } from '../errors/unauthorized'
import { HeaderType, HttpResponse } from '../protocols'

export const badRequest = (e: Error): HttpResponse => ({
  statusCode: 400,
  body: e
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const forbidden = (e: Error, headers?:HeaderType): HttpResponse => ({
  statusCode: 403,
  body: e,
  headers
})

export const notFound = (e: Error): HttpResponse => ({
  statusCode: 404,
  body: e
})

export const serverError = (e: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(e.stack)
})

export const success = (data: any, headers?: HeaderType) => ({
  statusCode: 200,
  body: data,
  headers
})

export const noContent = ():HttpResponse => ({
  statusCode: 204,
  body: null
})
