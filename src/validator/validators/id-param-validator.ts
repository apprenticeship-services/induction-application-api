import { Validator } from '@/presentation/protocols/validator'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '@/presentation/errors/invalid-params'

export class IdParamValidation implements Validator {
  constructor (private readonly paramName: string, private readonly idParamValidator: EmailValidator) {
    this.paramName = paramName
    this.idParamValidator = idParamValidator
  }

  validate (params: object): Error {
    const isValid = this.idParamValidator.isValid(params[this.paramName])
    if (!isValid) {
      return new InvalidParamError(this.paramName)
    }
  }
}
