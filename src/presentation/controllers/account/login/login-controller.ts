import { Authentication } from '@/domain/use-cases/authentication'
import { badRequest, serverError, unauthorized } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { Validator } from '@/presentation/protocols/validator'

export class LoginController implements Controller {
  constructor (
      private readonly validator: Validator,
      private readonly authentication: Authentication) {
    this.validator = validator
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(request.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = request.body
      const userCredentials = await this.authentication.auth({ email, password })

      if (!userCredentials) {
        return unauthorized()
      }
    } catch (e) {
      return serverError(e)
    }
  }
}
