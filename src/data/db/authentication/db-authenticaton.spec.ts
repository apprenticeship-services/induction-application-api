import { LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'
import { AccountModel } from '@/domain/models/account'
import { AuthenticationParams } from '@/domain/use-cases/authentication'

type Sut = {
    sut: DbAuthentication,
    loadAccountByEmailRepoStub: LoadAccountByEmailRepository
}

const makeSut = (): Sut => {
  const loadAccountByEmailRepoStub = makeLoadAccountByEmailRepo()
  const sut = new DbAuthentication(loadAccountByEmailRepoStub)
  return {
    sut,
    loadAccountByEmailRepoStub
  }
}

const makeLoadAccountByEmailRepo = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    loadByEmail (email: string): Promise<AccountModel> {
      return Promise.resolve(fakeAccountModel())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const fakeAccountModel = (): AccountModel => ({
  _id: 'any_id',
  name: 'any_name',
  email: 'any_email@hotmail.com',
  role: 'any_role',
  password: 'hashed_password',
  createdAt: new Date()
})

const fakeCredentials = (): AuthenticationParams => ({
  email: 'any_email@hotmail.com',
  password: 'any_password'
})
describe('Db Authentication Use-case', () => {
  test('Should call LoadByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepoStub } = makeSut()
    const loadAccountSpy = jest.spyOn(loadAccountByEmailRepoStub, 'loadByEmail')
    await sut.auth(fakeCredentials())
    expect(loadAccountSpy).toHaveBeenCalledWith(fakeCredentials().email)
  })
})
