import { Validator } from '@/presentation/protocols/validator'
import { ValidatorComposite } from './validation-composite'
import { MissingParamError } from '@/presentation/errors/missing-param'
import { InvalidParamError } from '@/presentation/errors/invalid-params'

type SutTypes = {
    sut: ValidatorComposite,
    validatorsStub: Validator[]
}

const makeSut = ():SutTypes => {
  const validatorsStub = [makeValidation(), makeValidation()]
  const sut = new ValidatorComposite(validatorsStub)
  return {
    sut,
    validatorsStub
  }
}

const makeValidation = () => {
  class ValidationStub implements Validator {
    validate (input: object): Error {
      return null
    }
  }
  return new ValidationStub()
}

const fakeInput = () => ({ field: 'any_value' })

describe('Validator Composite', () => {
  test('Should return error if validator fails', () => {
    const { sut, validatorsStub } = makeSut()
    jest.spyOn(validatorsStub[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const isError = sut.validate(fakeInput())
    expect(isError).toEqual(new MissingParamError('field'))
  })

  test('Should return invalid email error if validator fails', () => {
    const { sut, validatorsStub } = makeSut()
    jest.spyOn(validatorsStub[1], 'validate').mockReturnValueOnce(new InvalidParamError('email'))
    const isError = sut.validate(fakeInput())
    expect(isError).toEqual(new InvalidParamError('email'))
  })

  test('Should return first error encountered', () => {
    const { sut, validatorsStub } = makeSut()
    jest.spyOn(validatorsStub[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validatorsStub[1], 'validate').mockReturnValueOnce(new InvalidParamError('email'))
    const isError = sut.validate(fakeInput())
    expect(isError).toEqual(new Error())
  })
})
