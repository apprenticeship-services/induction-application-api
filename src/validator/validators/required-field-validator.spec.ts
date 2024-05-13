import { MissingParamError } from '@/presentation/errors/missing-param'
import { HttpRequest } from '@/presentation/protocols'
import { RequiredFieldValidator } from './requires-field-validator'

const fakeRequest = (): HttpRequest => ({
  body: {
    input: 'any_input'
  }
})

describe('Required Fields Validation', () => {
  test('Should return MissingParamsError if field is empty', () => {
    const sut = new RequiredFieldValidator('missingInput')
    const error = sut.validate(fakeRequest().body)
    expect(error).toEqual(new MissingParamError('missingInput'))
  })
})
