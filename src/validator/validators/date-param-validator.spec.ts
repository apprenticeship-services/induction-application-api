import { InvalidParamError } from '@/presentation/errors/invalid-params'
import { ValueValidator } from '../protocols/value-validator'
import { DateParamValidator } from './date-param-validator'
import MockDate from 'mockdate'

type SutType = {
    sut: DateParamValidator,
    dateParamValidator: ValueValidator,
}
const makeSut = (): SutType => {
  const dateParamValidator = makeDateParamValidatorStub()
  const sut = new DateParamValidator('date', dateParamValidator)
  return {
    sut,
    dateParamValidator
  }
}

const makeDateParamValidatorStub = (): ValueValidator => {
  class DateParamValidator implements ValueValidator {
    isValid (value: string): boolean {
      return true
    }
  }
  return new DateParamValidator()
}

const fakeParams = () => ({
  date: new Date()
})

describe('IdParamValidation', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())
  test('Should call DateParamValidator with correct value', () => {
    const { sut, dateParamValidator } = makeSut()
    const isValidSpy = jest.spyOn(dateParamValidator, 'isValid')
    sut.validate(fakeParams())
    expect(isValidSpy).toHaveBeenCalledWith(fakeParams().date)
  })

  test('Should return error if DateParamValidator returns false', () => {
    const { sut, dateParamValidator } = makeSut()
    jest.spyOn(dateParamValidator, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate(fakeParams())
    expect(error).toEqual(new InvalidParamError('date'))
  })

  test('Should throw if DateParamValidator throws', async () => {
    const { sut, dateParamValidator } = makeSut()
    jest.spyOn(dateParamValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})
