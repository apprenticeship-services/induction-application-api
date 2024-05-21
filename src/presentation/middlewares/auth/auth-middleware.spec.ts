import { HttpRequest } from '@/presentation/protocols'
import { AuthMiddleware } from './auth-middleware'
import { AccountModel } from '@/domain/models/account'
import { forbidden } from '@/presentation/helpers/http-helper'
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
})
