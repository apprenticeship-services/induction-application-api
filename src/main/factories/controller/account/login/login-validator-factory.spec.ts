import { EmailValidation } from '@/validator/validators/email-validator'
import { RequiredFieldValidator } from '@/validator/validators/requires-field-validator'
import { ValidatorComposite } from '@/validator/validators/validation-composite'
import { loginValidatorFactory } from './login-validator-factory'
import { ValueValidator } from '@/validator/protocols/value-validator'

jest.mock('@/validator/validators/validation-composite')
const makeEmailValidatorStub = (): ValueValidator => {
  class EmailValidatorStub implements ValueValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Register Admin Account Validation', () => {
  test('Should call ValidationComposite with all validations', () => {
    loginValidatorFactory()
    const validators = []

    for (const requiredField of ['email', 'password']) {
      validators.push(new RequiredFieldValidator(requiredField))
    }
    validators.push(new EmailValidation('email', makeEmailValidatorStub()))

    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
