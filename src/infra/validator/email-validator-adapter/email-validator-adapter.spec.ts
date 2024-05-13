import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

const fakeEmail = () => 'any_email@hotmail.com'

describe('EmailValidatorAdapter', () => {
  test('Should call isEmail method with correct value', () => {
    const sut = new EmailValidatorAdapter()
    const validatorSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid(fakeEmail())
    expect(validatorSpy).toHaveBeenCalledWith('any_email@hotmail.com')
  })
})
