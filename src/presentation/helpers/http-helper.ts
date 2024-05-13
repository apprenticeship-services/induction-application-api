import { ServerError } from '../errors/server-error'
import { HttpResponse } from '../protocols'

export const forbidden = (e: Error): HttpResponse => ({
  statusCode: 403,
  body: e
})

export const noContent = ():HttpResponse => ({
  statusCode: 204,
  body: null
})

export const serverError = (e: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(e.stack)
})
