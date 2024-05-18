import { EmailValidator } from '@/validator/protocols/email-validator'
import { EmailValidation } from '@/validator/validators/email-validator'
import { RequiredFieldValidator } from '@/validator/validators/requires-field-validator'
import { ValidatorComposite } from '@/validator/validators/validation-composite'
import { registerApprenticeAccountValidatorFactory } from './register-apprentice-account-validator-factory'
import { EmailValidatorAdapter } from '@/infra/validator/email-validator-adapter/email-validator-adapter'

jest.mock('@/validator/validators/validation-composite')
const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Register Apprentice Account Validation', () => {
  test('Should call ValidationComposite with all validations', () => {
    registerApprenticeAccountValidatorFactory()
    const validators = []
    enum RequiredAdminFields {
        Name = 'name',
        Email = 'email',
        Trade = 'trade',
        Advisor = 'advisor'
    }

    for (const requiredField of [RequiredAdminFields.Name, RequiredAdminFields.Email, RequiredAdminFields.Trade, RequiredAdminFields.Advisor]) {
      validators.push(new RequiredFieldValidator(requiredField))
    }
    validators.push(new EmailValidation(RequiredAdminFields.Email, makeEmailValidatorStub()))

    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
