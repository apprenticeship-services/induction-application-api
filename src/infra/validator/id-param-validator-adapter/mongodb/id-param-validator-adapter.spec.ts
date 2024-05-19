import { ObjectId } from 'mongodb'
import { IdParamValidatorAdapter } from './id-param-validator'

const fakeId = () => new ObjectId().toString()

describe('IdParamValidatorAdapter', () => {
  test('Should call ObjectId method with correct value', () => {
    const sut = new IdParamValidatorAdapter()
    const objectIdSpy = jest.spyOn(ObjectId, 'isValid')
    const id = fakeId()
    sut.isValid(id)
    expect(objectIdSpy).toHaveBeenCalledWith(id)
  })

  test('Should return true if ObjectId method returns true', () => {
    const sut = new IdParamValidatorAdapter()
    jest.spyOn(ObjectId, 'isValid').mockReturnValueOnce(true)
    const id = fakeId()
    const result = sut.isValid(id)
    expect(result).toBe(true)
  })

  test('Should return false if ObjectId method returns false', () => {
    const sut = new IdParamValidatorAdapter()
    jest.spyOn(ObjectId, 'isValid').mockReturnValueOnce(false)
    const id = fakeId()
    const result = sut.isValid(id)
    expect(result).toBe(false)
  })
})
