import { EmailValidatorAdapter } from './email-validator-adapter'
import Validator from 'email-validator'

const fakeEmail = () => 'any_email@hotmail.com'

describe('EmailValidatorAdapter', () => {
  test('Should call validate method with correct value', () => {
    const sut = new EmailValidatorAdapter()
    const validatorSpy = jest.spyOn(Validator, 'validate')
    sut.isValid(fakeEmail())
    expect(validatorSpy).toHaveBeenCalledWith('any_email@hotmail.com')
  })

  test('Should return true if validate method returns true', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(Validator, 'validate').mockReturnValueOnce(true)
    const isValid = sut.isValid(fakeEmail())
    expect(isValid).toBe(true)
  })

  test('Should return false if validate method returns false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(Validator, 'validate').mockReturnValueOnce(false)
    const isValid = sut.isValid(fakeEmail())
    expect(isValid).toBe(false)
  })

  test('Should return false if validate method returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('#$%^&((@gmail.com')
    expect(isValid).toBe(false)
  })
})
