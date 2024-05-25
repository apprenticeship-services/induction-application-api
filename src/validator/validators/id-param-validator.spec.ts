import { IdParamValidation } from './id-param-validator'
import { InvalidParamError } from '@/presentation/errors/invalid-params'
import { ValueValidator } from '../protocols/value-validator'

type SutType = {
    sut: IdParamValidation,
    idParamValidator: ValueValidator,
}
const makeSut = (): SutType => {
  const idParamValidator = makeIdParamValidatorStub()
  const sut = new IdParamValidation('id', idParamValidator)
  return {
    sut,
    idParamValidator
  }
}

const makeIdParamValidatorStub = (): ValueValidator => {
  class IdParamValidatorStub implements ValueValidator {
    isValid (id: string): boolean {
      return true
    }
  }
  return new IdParamValidatorStub()
}

const fakeParams = () => ({
  id: 'any_id'
})

describe('IdParamValidation', () => {
  test('Should call IdParamValidator with correct id', () => {
    const { sut, idParamValidator } = makeSut()
    const isValidSpy = jest.spyOn(idParamValidator, 'isValid')
    sut.validate(fakeParams())
    expect(isValidSpy).toHaveBeenCalledWith(fakeParams().id)
  })

  test('Should return error if IdParamValidator returns false', () => {
    const { sut, idParamValidator } = makeSut()
    jest.spyOn(idParamValidator, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate(fakeParams())
    expect(error).toEqual(new InvalidParamError('id'))
  })

  test('Should throw if IdParamValidator throws', async () => {
    const { sut, idParamValidator } = makeSut()
    jest.spyOn(idParamValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})
