import { Validator } from '@/presentation/protocols/validator'

export class ValidatorComposite implements Validator {
  constructor (private readonly validators: Validator[]) {
    this.validators = validators
  }

  validate (input: object): Error {
    for (const validator of this.validators) {
      const isError = validator.validate(input)
      if (isError) return isError
    }
  }
}
