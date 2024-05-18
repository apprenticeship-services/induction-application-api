import { EmailValidatorAdapter } from '@/infra/validator/email-validator-adapter/email-validator-adapter'
import { EmailValidation } from '@/validator/validators/email-validator'
import { RequiredFieldValidator } from '@/validator/validators/requires-field-validator'
import { ValidatorComposite } from '@/validator/validators/validation-composite'

export const registerApprenticeAccountValidatorFactory = (): ValidatorComposite => {
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
    validators.push(new EmailValidation(RequiredAdminFields.Email, new EmailValidatorAdapter()))

    return new ValidatorComposite(validators)
}
