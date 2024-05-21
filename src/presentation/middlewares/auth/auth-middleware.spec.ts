import { HttpRequest } from '@/presentation/protocols'
import { AuthMiddleware } from './auth-middleware'
import { AccountModel } from '@/domain/models/account'
import { forbidden, serverError, success } from '@/presentation/helpers/http-helper'
import { AccessDeniedError } from '@/presentation/errors/access-denied-error'
import { LoadAccountByToken } from '@/domain/use-cases/load-account-by-token'

type SutTypes = {
    sut: AuthMiddleware,
    loadAccountByTokenStub: LoadAccountByToken
}
const makeSut = (role?:string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return {
    sut,
    loadAccountByTokenStub
  }
}

const mockAccountModel = ():AccountModel => (
  {
    _id: 'any_id',
    name: 'any_name',
    role: 'any_role',
    email: 'any_email@hotmail.com',
    password: 'any_password',
    createdAt: new Date()
  }
)

const makeFakeCookieWithToken = (): HttpRequest => ({
  cookies: {
    token: 'any_token'
  }
})

const makeLoadAccountByTokenStub = ():LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async loadByToken (token: string, rolePermission?: string | undefined): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByTokenStub()
}

describe('Auth Middleware', () => {
  test('Should return 403 access denied if no token is provided on cookies', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({})
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct token and role', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken')
    const httpRequest = makeFakeCookieWithToken()
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith('any_token', role)
  })

  test('Should return 403 if LoadAccountByToken does not find a user', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockReturnValueOnce(Promise.resolve(null))
    const httpRequest = makeFakeCookieWithToken()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken finds user', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeCookieWithToken()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(success({ accountId: 'any_id' }))
  })

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockReturnValueOnce(Promise.reject(new Error()))
    const httpRequest = makeFakeCookieWithToken()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(serverError(new Error()))
  })
})
