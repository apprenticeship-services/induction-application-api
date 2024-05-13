import { RegisterAdminAccount } from '@/domain/use-cases/register-admin-account'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class RegisterAdminAccountController implements Controller {
  constructor (
        private readonly registerAdminAccount: RegisterAdminAccount) {
    this.registerAdminAccount = registerAdminAccount
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const account = await this.registerAdminAccount.register(request.body)
      return null
    } catch (e) {

    }
  }
}
