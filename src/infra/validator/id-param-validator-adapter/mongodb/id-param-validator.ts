import { ValueValidator } from '@/validator/protocols/value-validator'
import { ObjectId } from 'mongodb'

export class IdParamValidatorAdapter implements ValueValidator {
  isValid (value: string): boolean {
    return ObjectId.isValid(value)
  }
}
