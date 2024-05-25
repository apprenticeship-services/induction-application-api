import { Validator } from '@/presentation/protocols/validator'
import { ValueValidator } from '../protocols/value-validator'
import { InvalidParamError } from '@/presentation/errors/invalid-params'

export class DateParamValidator implements Validator {
  constructor (private readonly paramName: string, private readonly dateParamValidator: ValueValidator) {
    this.paramName = paramName
    this.dateParamValidator = dateParamValidator
  }

  validate (params: object): Error {
    const isValid = this.dateParamValidator.isValid(params[this.paramName])
    if (!isValid) {
      return new InvalidParamError(this.paramName)
    }
  }
}
