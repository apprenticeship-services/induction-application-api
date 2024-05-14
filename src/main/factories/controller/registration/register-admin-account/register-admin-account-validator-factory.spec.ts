import { EmailValidator } from '@/validator/protocols/email-validator'
import { EmailValidation } from '@/validator/validators/email-validator'
import { RequiredFieldValidator } from '@/validator/validators/requires-field-validator'
import { ValidatorComposite } from '@/validator/validators/validation-composite'
import { registerAdminAccountValidatorFactory } from './register-admin-account-validator-factory'

jest.mock('@/validator/validators/validation-composite')
const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Register Admin Account Validation', () => {
  test('Should call ValidationComposite with all validations', () => {
    registerAdminAccountValidatorFactory()
    const validators = []
    enum RequiredAdminFields {
        Name = 'name',
        Email = 'email'
    }

    for (const requiredField of [RequiredAdminFields.Name, RequiredAdminFields.Email]) {
      validators.push(new RequiredFieldValidator(requiredField))
    }
    validators.push(new EmailValidation(RequiredAdminFields.Email, makeEmailValidatorStub()))

    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
