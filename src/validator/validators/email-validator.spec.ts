import { InvalidParamError } from '@/presentation/errors/invalid-params'
import { EmailValidator } from '../protocols/email-validator'
import { EmailValidation } from './email-validator'

type SutType = {
    sut: EmailValidation,
    emailValidatorStub: EmailValidator,
}
const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Email Validation', () => {
  // Test email validator instance
  test('Should call Email Validator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: 'valid@email.com' })
    expect(isValidSpy).toHaveBeenCalledWith('valid@email.com')
  })
})
