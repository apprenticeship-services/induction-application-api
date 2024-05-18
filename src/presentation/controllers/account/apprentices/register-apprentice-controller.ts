import { RegisterApprenticeAccount } from '@/domain/use-cases/register-apprentice-account'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { Validator } from '@/presentation/protocols/validator'

export class RegisterApprenticeController implements Controller {
  constructor (
        private readonly validator: Validator,
      private readonly registerApprenticeAccount: RegisterApprenticeAccount) {
    this.validator = validator
    this.registerApprenticeAccount = registerApprenticeAccount
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const error = this.validator.validate(request.body)
    return null
  }
}
