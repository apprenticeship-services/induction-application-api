import { LoadApprenticesByDateRangeRepository } from '@/data/protocols/db/load-apprentices-by-date-range-repository'
import { DbDeleteAdminAccountById } from '../../account/db-delete-admin-account'
import { DbLoadApprenticeByDateRange } from './db-load-apprentices-by-date-range'
import { ApprenticeInformationModel } from '@/domain/use-cases/load-apprentices-by-date-range'

type SutTypes = {
    sut: DbLoadApprenticeByDateRange,
    loadApprenticesByDateRangeRepositoryStub: LoadApprenticesByDateRangeRepository
}
const makeSut = ():SutTypes => {
  const loadApprenticesByDateRangeRepositoryStub = makeLoadApprenticesByDateRangeRepositoryStub()
  const sut = new DbLoadApprenticeByDateRange(loadApprenticesByDateRangeRepositoryStub)
  return {
    sut,
    loadApprenticesByDateRangeRepositoryStub
  }
}

const makeLoadApprenticesByDateRangeRepositoryStub = () => {
  class LoadApprenticesByDateRangeRepositoryStub implements LoadApprenticesByDateRangeRepository {
    async loadByDateRange (startDate: Date, endDate: Date): Promise<ApprenticeInformationModel[]> {
      return await Promise.resolve(fakeApprenticeInfoModelArray())
    }
  }
  return new LoadApprenticesByDateRangeRepositoryStub()
}

const fakeApprenticeInfoModelArray = (): ApprenticeInformationModel[] => ([
  {
    accountId: 'any_id',
    name: 'any_name',
    email: 'any_email@hotmail.com',
    role: 'apprentice',
    createdAt: new Date(),
    advisor: 'any_advisor',
    trade: 'any_trade',
    induction: true,
    assessment: true,
    updatedAt: new Date()
  },
  {
    accountId: 'other_id',
    name: 'other_name',
    email: 'other_email@hotmail.com',
    role: 'apprentice',
    createdAt: new Date(),
    advisor: 'other_advisor',
    trade: 'other_trade',
    induction: false,
    assessment: false,
    updatedAt: null
  }
])

const startDate = new Date()
const endDate = new Date()

describe('DbLoadApprenticeByDateRange', () => {
  test('Should call LoadApprenticesByDateRangeRepository with correct start and end date', async () => {
    const { sut, loadApprenticesByDateRangeRepositoryStub } = makeSut()
    const loadByDateRangeSpy = jest.spyOn(loadApprenticesByDateRangeRepositoryStub, 'loadByDateRange')
    await sut.loadByDateRange(startDate, endDate)
    expect(loadByDateRangeSpy).toHaveBeenCalledWith(startDate, endDate)
  })

  test('Should throw if LoadApprenticesByDateRangeRepository throw', async () => {
    const { sut, loadApprenticesByDateRangeRepositoryStub } = makeSut()
    jest.spyOn(loadApprenticesByDateRangeRepositoryStub, 'loadByDateRange').mockReturnValueOnce(Promise.reject(new Error()))
    const response = sut.loadByDateRange(startDate, endDate)
    await expect(response).rejects.toThrow()
  })

  test('Should return empty array even on success', async () => {
    const { sut, loadApprenticesByDateRangeRepositoryStub } = makeSut()
    jest.spyOn(loadApprenticesByDateRangeRepositoryStub, 'loadByDateRange').mockReturnValueOnce(Promise.resolve([]))
    const response = await sut.loadByDateRange(startDate, endDate)
    expect(response).toEqual([])
  })

  test('Should return apprentices on success', async () => {
    const { sut } = makeSut()
    const response = await sut.loadByDateRange(startDate, endDate)
    expect(response[0]).toBeTruthy()
    expect(response[0].accountId).toBeTruthy()
    expect(response[1]).toBeTruthy()
    expect(response[1].accountId).toBeTruthy()
  })
})
