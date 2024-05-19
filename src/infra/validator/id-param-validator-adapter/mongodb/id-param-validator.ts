import { IdParamValidator } from '@/validator/protocols/id-param-validator'
import { ObjectId } from 'mongodb'

export class IdParamValidatorAdapter implements IdParamValidator {
  isValid (id: string): boolean {
    return ObjectId.isValid(id)
  }
}
