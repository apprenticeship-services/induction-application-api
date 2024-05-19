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

  test('Should throw if LoadAccountByIdRepository throws', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    const account = sut.loadById(fakeAccountId())
    expect(account).rejects.toThrow()
  })

  test('Should returns null if LoadAccountByIdRepository returns null', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const account = await sut.loadById(fakeAccountId())
    expect(account).toBeNull()
  })

  test('Should returns correct account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.loadById(fakeAccountId())
    expect(account).toBeTruthy()
    expect(account._id).toBe(fakeAccountModel()._id)
  })
})
