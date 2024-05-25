import { InvalidParamError } from '@/presentation/errors/invalid-params'
import { EmailValidation } from './email-validator'
import { ValueValidator } from '../protocols/value-validator'

type SutType = {
    sut: EmailValidation,
    emailValidatorStub: ValueValidator,
}
const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

const makeEmailValidatorStub = (): ValueValidator => {
  class EmailValidatorStub implements ValueValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Email Validation', () => {
  test('Should call Email Validator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: 'valid@email.com' })
    expect(isValidSpy).toHaveBeenCalledWith('valid@email.com')
  })

  test('Should return error if email is invalid', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate({ email: 'invalid' })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('Should throw if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})
