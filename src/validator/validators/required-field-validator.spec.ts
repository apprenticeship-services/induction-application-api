import { MissingParamError } from '@/presentation/errors/missing-param'
import { HttpRequest } from '@/presentation/protocols'
import { RequiredFieldValidator } from './requires-field-validator'

const fakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@hotmail.com'
  }
})

describe('Required Fields Validation', () => {
  test('Should return MissingParamsError if field is empty', () => {
    const sut = new RequiredFieldValidator('missingInput')
    const error = sut.validate(fakeRequest().body)
    expect(error).toEqual(new MissingParamError('missingInput'))
  })

  test('Should return null on if inputs are valid', () => {
    const sut = new RequiredFieldValidator('name')
    const error = sut.validate(fakeRequest().body)
    expect(error).toBeNull()
  })
})
