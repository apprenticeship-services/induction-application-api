import { DbLoadApprenticeInformationByAccountId } from './db-load-apprentice-information-by-account-id'
import { LoadApprenticeInformationByAccountIdRepository } from '@/data/protocols/db/load-apprentice-information-by-account-id-repository'
import { ApprenticeModel } from '@/domain/models/apprentice-model'
import MockDate from 'mockdate'

type Sut = {
  sut: DbLoadApprenticeInformationByAccountId,
  loadApprenticeInformationByAccountIdRepoStub: LoadApprenticeInformationByAccountIdRepository
}

const makeSut = (): Sut => {
  const loadApprenticeInformationByAccountIdRepoStub = makeLoadApprenticeInformationByAccountIdRepoStub()
  const sut = new DbLoadApprenticeInformationByAccountId(loadApprenticeInformationByAccountIdRepoStub)
  return {
    sut,
    loadApprenticeInformationByAccountIdRepoStub
  }
}

const makeLoadApprenticeInformationByAccountIdRepoStub = (): LoadApprenticeInformationByAccountIdRepository => {
  class LoadApprenticeInformationByAccountIdRepositoryStub implements LoadApprenticeInformationByAccountIdRepository {
    loadById (accountId: string): Promise<ApprenticeModel> {
      return Promise.resolve(fakeApprenticeModel())
    }
  }
  return new LoadApprenticeInformationByAccountIdRepositoryStub()
}

const fakeApprenticeModel = (): ApprenticeModel => ({
  _id: 'any_id',
  accountId: 'any_accountId',
  trade: 'any_trade',
  advisor: 'any_advisor',
  induction: false,
  assessment: false,
  updatedAt: new Date()
})

const fakeAccountId = 'any_accountId'

describe('DbLoadApprenticeInformationByAccountId', () => {
  beforeEach(() => MockDate.set(new Date()))
  afterEach(() => MockDate.reset())
  test('Should call LoadApprenticeInformationByAccountIdRepository with correct values', async () => {
    const { sut, loadApprenticeInformationByAccountIdRepoStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadApprenticeInformationByAccountIdRepoStub, 'loadById')
    await sut.loadById(fakeAccountId)
    expect(loadByIdSpy).toHaveBeenCalledWith(fakeAccountId)
  })

  test('Should throw if LoadApprenticeInformationByAccountIdRepository throws', async () => {
    const { sut, loadApprenticeInformationByAccountIdRepoStub } = makeSut()
    jest.spyOn(loadApprenticeInformationByAccountIdRepoStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    const updateResult = sut.loadById(fakeAccountId)
    await expect(updateResult).rejects.toThrow()
  })

  test('Should return apprentice information on success', async () => {
    const { sut } = makeSut()
    const updateResult = await sut.loadById(fakeAccountId)
    expect(updateResult).toBeTruthy()
    expect(updateResult.accountId).toBe('any_accountId')
  })

  test('Should return null if LoadApprenticeInformationByAccountIdRepository returns null', async () => {
    const { sut, loadApprenticeInformationByAccountIdRepoStub } = makeSut()
    jest.spyOn(loadApprenticeInformationByAccountIdRepoStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const updateResult = await sut.loadById(fakeAccountId)
    expect(updateResult).toBeNull()
  })
})
