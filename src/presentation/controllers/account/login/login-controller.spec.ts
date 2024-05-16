import { Validator } from '@/presentation/protocols/validator'
import { LoginController } from './login-controller'
import { AuthenticationParams } from '@/domain/use-cases/authentication'
import { HttpRequest } from '@/presentation/protocols'
import { ValidatorComposite } from '@/validator/validators/validation-composite'
import { MissingParamError } from '@/presentation/errors/missing-param'
import { badRequest } from '@/presentation/helpers/http-helper'
import { InvalidParamError } from '@/presentation/errors/invalid-params'

type Sut = {
    sut: LoginController
    validatorStub: Validator
}

const makeSut = (): Sut => {
  const validatorStub = new ValidatorComposite([makeValidatorStub()])
  const sut = new LoginController(validatorStub)
  return {
    sut,
    validatorStub
  }
}

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: object): Error {
      return null
    }
  }
  return new ValidatorStub()
}

const fakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@hotmail.com',
    password: 'any_password'
  }
})

describe('Login Controller', () => {
  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validatorSpy = jest.spyOn(validatorStub, 'validate')
    await sut.handle(fakeRequest())
    expect(validatorSpy).toHaveBeenCalledWith(fakeRequest().body)
  })

  test('Should return 400 if email is not provided', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new MissingParamError('email'))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(badRequest(new MissingParamError('email')))
  })
})
