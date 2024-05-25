import { ValueValidator } from '@/validator/protocols/value-validator'
import * as Validator from 'email-validator'
export class EmailValidatorAdapter implements ValueValidator {
  isValid (email: string): boolean {
    return Validator.validate(email)
  }
}
