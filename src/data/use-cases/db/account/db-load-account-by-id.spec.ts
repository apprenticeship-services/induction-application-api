import { LoadAccountByIdRepository } from '@/data/protocols/db/load-account-by-id-repository'
import { DbLoadAccountById } from './db-load-account-by-id'
import { AccountModel } from '@/domain/models/account'

type Sut = {
    sut: DbLoadAccountById,
    loadAccountByIdRepositoryStub: LoadAccountByIdRepository
}

const makeSut = (): Sut => {
  const loadAccountByIdRepositoryStub = makeLoadAccountByIdRepositoryStub()
  const sut = new DbLoadAccountById(loadAccountByIdRepositoryStub)
  return {
    sut,
    loadAccountByIdRepositoryStub
  }
}

const makeLoadAccountByIdRepositoryStub = (): LoadAccountByIdRepository => {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    loadById (accountId: any): Promise<AccountModel> {
      return Promise.resolve(fakeAccountModel())
    }
  }
  return new LoadAccountByIdRepositoryStub()
}

const fakeAccountId = (): string => 'any_id'

const fakeAccountModel = (): AccountModel => ({
  _id: 'any_id',
  name: 'any_name',
  email: 'any_email@hotmail.com',
  role: 'any_role',
  password: 'hashed_password',
  createdAt: new Date()
})

describe('DbLoadAccountById', () => {
  test('Should call LoadAccountByIdRepository with correct id', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadAccountByIdRepositoryStub, 'loadById')
    await sut.loadById(fakeAccountId())
    expect(loadByIdSpy).toHaveBeenCalledWith(fakeAccountId())
  })
})
