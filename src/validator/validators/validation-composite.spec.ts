import { Validator } from '@/presentation/protocols/validator'
import { ValidatorComposite } from './validation-composite'
import { MissingParamError } from '@/presentation/errors/missing-param'

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
})
