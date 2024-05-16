import { badRequest } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { Validator } from '@/presentation/protocols/validator'

export class LoginController implements Controller {
  constructor (
        private readonly validator: Validator) {
    this.validator = validator
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const error = this.validator.validate(request.body)
    if (error) {
      return badRequest(error)
    }
    return null
  }
}
