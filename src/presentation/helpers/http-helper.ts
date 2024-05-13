import { HttpResponse } from '../protocols'

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error
})
