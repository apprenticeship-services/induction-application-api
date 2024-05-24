import { LoadAccountByToken } from '@/domain/use-cases/load-account-by-token'
import { LoginByTokenController } from './login-by-token-controller'
import { AccountModel } from '@/domain/models/account'
import { HttpRequest } from '@/presentation/protocols'
import { forbidden, noContent, serverError, success } from '@/presentation/helpers/http-helper'
import env from '@/main/config/env'
import { AccessDeniedError } from '@/presentation/errors/access-denied-error'

type Sut = {
  sut: LoginByTokenController
  loadAccountByTokenStub: LoadAccountByToken
}
const makeSut = (): Sut => {
  const loadAccountByTokenStub = makeLoadAccountByTokenStub()
  const sut = new LoginByTokenController(loadAccountByTokenStub)
  return {
    sut,
    loadAccountByTokenStub
  }
}

const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    loadByToken (token: string, rolePermission: string): Promise<AccountModel> {
      return Promise.resolve(fakeAccountModel())
    }
  }
  return new LoadAccountByTokenStub()
}

const fakeAccountModel = (): AccountModel => ({
  _id: 'any_id',
  name: 'any_name',
  email: 'any_email@hotmail.com',
  role: 'any_role',
  password: 'any_password',
  createdAt: new Date()
})

const fakeRequest = (): HttpRequest => ({
  reconnectToken: 'any_token'
})

const fakeTokenHeader = {
  token: {
    type: 'clearCookie',
    value: null,
    options: {
      httpOnly: true,
      secure: true,
      sameSite: env.nodeEnvironment === 'development' ? 'none' : 'strict'
    }
  }
}

describe('LoginByTokenController', () => {
  test('Should call LoadAccountByToken with correct values while reconnecting ', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken')
    await sut.handle(fakeRequest())
    expect(loadSpy).toHaveBeenCalledWith(fakeRequest().reconnectToken, 'reconnect')
  })

  test('Should return 204 if token is not provided', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({})
    expect(response).toEqual(noContent())
  })

  test('Should return 403 if LoadAccountByToken returns no account', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(forbidden(new AccessDeniedError(), fakeTokenHeader))
  })

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(success({
      name: fakeAccountModel().name,
      email: fakeAccountModel().email,
      role: fakeAccountModel().role
    }))
  })
})
