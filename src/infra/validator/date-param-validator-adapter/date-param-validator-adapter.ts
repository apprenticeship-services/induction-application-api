import { ValueValidator } from '@/validator/protocols/value-validator'
export class DateParamValidatorAdapter implements ValueValidator {
  isValid (value: string): boolean {
    try {
      if (!value) {
        return false
      }
      const date = new Date(value)
      if (isNaN(date.getTime())) {
        return false
      }
      return true
    } catch (error) {
      return false
    }
  }
}
