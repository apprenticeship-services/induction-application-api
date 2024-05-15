import { EmailValidator } from '@/validator/protocols/email-validator'
import * as Validator from 'email-validator'
export class EmailValidatorAdapter implements EmailValidator {
  isValid (email: string): boolean {
    return Validator.validate(email)
  }
}
