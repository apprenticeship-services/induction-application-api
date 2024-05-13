import { MissingParamError } from '@/presentation/errors/missing-param'
import { Validator } from '@/presentation/protocols/validator'

export class RequiredFieldValidator implements Validator {
  constructor (private readonly requiredField:string) {
    this.requiredField = requiredField
  }

  validate (input: object): Error {
    if (!input[this.requiredField]) {
      return new MissingParamError(this.requiredField)
    }
  }
}
