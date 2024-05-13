import { RegisterAdminAccount } from '@/domain/use-cases/register-admin-account'
import { AlreadyExists } from '@/presentation/errors/already-exists'
import { forbidden, noContent, serverError } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class RegisterAdminAccountController implements Controller {
  constructor (
        private readonly registerAdminAccount: RegisterAdminAccount) {
    this.registerAdminAccount = registerAdminAccount
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
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
