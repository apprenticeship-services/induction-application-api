import { HttpRequest } from '@/presentation/protocols'
import { RegisterAdminAccountController } from './register-admin-controller'
import { RegisterAdminAccount, RegisterAdminAccountParams } from '@/domain/use-cases/register-admin-account'
import { AccountModel } from '@/domain/models/account'
import { badRequest, forbidden, noContent, serverError } from '@/presentation/helpers/http-helper'
import { AlreadyExists } from '@/presentation/errors/already-exists'
import { Validator } from '@/presentation/protocols/validator'
import { InvalidParams } from '@/presentation/errors/invalid-params'

type Sut = {
    sut: RegisterAdminAccountController,
    registerAdminAccountStub: RegisterAdminAccount,
    validatorStub: Validator
}

const makeSut = (): Sut => {
  const registerAdminAccountStub = makeRegisterAdminAccountSub()
  const validatorStub = makeValidatorStub()
  const sut = new RegisterAdminAccountController(registerAdminAccountStub, validatorStub)
  return {
    sut,
    registerAdminAccountStub,
    validatorStub
  }
}

const makeRegisterAdminAccountSub = (): RegisterAdminAccount => {
  class RegisterAdminAccountStub implements RegisterAdminAccount {
    async register (credentials: RegisterAdminAccountParams): Promise<AccountModel> {
      return Promise.resolve(fakeAccountModel())
    }
  }
  return new RegisterAdminAccountStub()
}

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: string): Error {
      return null
    }
  }
  return new ValidatorStub()
}

const fakeRequest = (): HttpRequest => ({
  body: fakeAdminAccount()
})

const fakeAdminAccount = () => ({
  name: 'any_name',
  email: 'any_email@hotmail.com'
})

const fakeAccountModel = (): AccountModel => ({
  _id: 'any_id',
  name: 'any_name',
  email: 'any_email@hotmail.com',
  password: 'any_password'
})

describe('RegisterAdminController', () => {
  test('Should Call RegisterAdminAccount with correct values', async () => {
    const { sut, registerAdminAccountStub } = makeSut()
    const registerSpy = jest.spyOn(registerAdminAccountStub, 'register')
    await sut.handle(fakeRequest())
    expect(registerSpy).toHaveBeenCalledWith(fakeAdminAccount())
  })

  test('Should return error 403 if email already exists and RegisterAdminAccount returns null', async () => {
    const { sut, registerAdminAccountStub } = makeSut()
    jest.spyOn(registerAdminAccountStub, 'register').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(forbidden(new AlreadyExists('email')))
  })

  test('Should return 400 if Validator throws error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new InvalidParams('email'))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(badRequest(new InvalidParams('email')))
  })

  test('Should return 500 if RegisterAdminAccount throws', async () => {
    const { sut, registerAdminAccountStub } = makeSut()
    jest.spyOn(registerAdminAccountStub, 'register').mockReturnValueOnce(Promise.reject(new Error('e')))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(noContent())
  })
})
