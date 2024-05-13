import { HttpRequest } from '@/presentation/protocols'
import { RegisterAdminAccountController } from './register-admin-controller'
import { RegisterAdminAccount, RegisterAdminAccountParams } from '@/domain/use-cases/register-admin-account'
import { AccountModel } from '@/domain/models/account'
import { forbidden } from '@/presentation/helpers/http-helper'
import { AlreadyExists } from '@/presentation/errors/already-exists'

type Sut = {
    sut: RegisterAdminAccountController,
    registerAdminAccountStub: any
}

const makeSut = (): Sut => {
  const registerAdminAccountStub = makeRegisterAdminAccountSub()
  const sut = new RegisterAdminAccountController(registerAdminAccountStub)
  return {
    sut,
    registerAdminAccountStub
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
})
