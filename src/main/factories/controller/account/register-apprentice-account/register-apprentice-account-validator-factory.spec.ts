import { EmailValidation } from '@/validator/validators/email-validator'
import { RequiredFieldValidator } from '@/validator/validators/requires-field-validator'
import { ValidatorComposite } from '@/validator/validators/validation-composite'
import { registerApprenticeAccountValidatorFactory } from './register-apprentice-account-validator-factory'
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
