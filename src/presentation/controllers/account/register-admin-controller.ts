import { RegisterAdminAccount } from '@/domain/use-cases/register-admin-account'
import { AlreadyExists } from '@/presentation/errors/already-exists'
import { badRequest, forbidden, noContent, serverError } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { Validator } from '@/presentation/protocols/validator'

export class RegisterAdminAccountController implements Controller {
  constructor (
    private readonly registerAdminAccount: RegisterAdminAccount,
    private readonly validator: Validator) {
    this.registerAdminAccount = registerAdminAccount
    this.validator = validator
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const isError = this.validator.validate(request.body)
      if (isError) {
        return badRequest(isError)
      }

      const account = await this.registerAdminAccount.register(request.body)
      if (!account) {
        return forbidden(new AlreadyExists('email'))
      }

      return noContent()
    } catch (e) {
      return serverError(e)
    }
  }
}
