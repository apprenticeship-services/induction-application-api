import { Validator } from '@/presentation/protocols/validator'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '@/presentation/errors/invalid-params'

export class EmailValidation implements Validator {
  constructor (private readonly fieldName: string, private readonly emailValidator: EmailValidator) {
    this.fieldName = fieldName
    this.emailValidator = emailValidator
  }

  validate (input: object): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
