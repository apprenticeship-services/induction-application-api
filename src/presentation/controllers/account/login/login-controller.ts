import { Authentication } from '@/domain/use-cases/authentication'
import { badRequest, serverError, success, unauthorized } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { Validator } from '@/presentation/protocols/validator'
import env from '@/main/config/env'

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

      if (!userCredentials?.accessToken) {
        return unauthorized()
      }
      const { accessToken, ...details } = userCredentials
      const tokenHeader = {
        token: {
          type: 'cookie',
          value: accessToken,
          options: {
            httpOnly: true,
            secure: true,
            sameSite: env.nodeEnvironment === 'development' ? 'none' : 'strict'
          }
        }
      }
      return success({
        ...details
      }, tokenHeader)
    } catch (e) {
      return serverError(e)
    }
  }
}
