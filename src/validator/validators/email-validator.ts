import { Validator } from '@/presentation/protocols/validator'
import { InvalidParamError } from '@/presentation/errors/invalid-params'
import { ValueValidator } from '../protocols/value-validator'

export class EmailValidation implements Validator {
  constructor (private readonly fieldName: string, private readonly emailValidator: ValueValidator) {
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
