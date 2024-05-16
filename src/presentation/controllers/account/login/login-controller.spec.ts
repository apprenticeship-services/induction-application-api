import { Validator } from '@/presentation/protocols/validator'
import { LoginController } from './login-controller'
import { HttpRequest } from '@/presentation/protocols'
import { ValidatorComposite } from '@/validator/validators/validation-composite'
import { MissingParamError } from '@/presentation/errors/missing-param'
import { badRequest, serverError } from '@/presentation/helpers/http-helper'
import { Authentication, AuthenticationParams } from '@/domain/use-cases/authentication'
import { UserCredentials } from '@/domain/models/user-credentials'

type Sut = {
    sut: LoginController
    validatorStub: Validator
    authenticationStub: Authentication
}

const makeSut = (): Sut => {
  const validatorStub = new ValidatorComposite([makeValidatorStub()])
  const authenticationStub = makeAuthenticationStub()
  const sut = new LoginController(validatorStub, authenticationStub)
  return {
    sut,
    validatorStub,
    authenticationStub
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

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    auth (authCredentials: AuthenticationParams): Promise<UserCredentials> {
      return Promise.resolve(fakeUserCredentials())
    }
  }
  return new AuthenticationStub()
}

const fakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@hotmail.com',
    password: 'any_password'
  }
})

const fakeAuthCredentials = (): AuthenticationParams => ({
  email: 'any_email@hotmail.com',
  password: 'any_password'
})

const fakeUserCredentials = (): UserCredentials => ({
  name: 'any_name',
  email: 'any_email@hotmail.com',
  role: 'any_role',
  accessToken: 'any_token'
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

  test('Should return 400 if password is not provided', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new MissingParamError('password'))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(fakeRequest())
    expect(authSpy).toHaveBeenCalledWith(fakeAuthCredentials())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })
})
