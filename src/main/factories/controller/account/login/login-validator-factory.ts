import { EmailValidatorAdapter } from '@/infra/validator/email-validator-adapter/email-validator-adapter'
import { EmailValidation } from '@/validator/validators/email-validator'
import { RequiredFieldValidator } from '@/validator/validators/requires-field-validator'
import { ValidatorComposite } from '@/validator/validators/validation-composite'

export const loginValidatorFactory = (): ValidatorComposite => {
  const validators = []
  for (const requiredField of ['email', 'password']) {
    validators.push(new RequiredFieldValidator(requiredField))
  }
  validators.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidatorComposite(validators)
}
