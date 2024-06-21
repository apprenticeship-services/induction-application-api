import { LoadApprenticeInformationByAccountIdRepository } from '@/data/protocols/db/load-apprentice-information-by-account-id-repository'
import { ApprenticeDetailsModel } from '@/domain/models/apprentice-details'
import { ApprenticeModel } from '@/domain/models/apprentice-model'
import { DbLoadApprenticeDetails } from './db-load-apprentice-details'

describe('DbLoadApprenticeDetails', () => {
  let loadApprenticeInformationByAccountIdRepositoryStub: jest.Mocked<LoadApprenticeInformationByAccountIdRepository>
  let sut: DbLoadApprenticeDetails

  beforeEach(() => {
    loadApprenticeInformationByAccountIdRepositoryStub = {
      loadById: jest.fn()
    }

    sut = new DbLoadApprenticeDetails(loadApprenticeInformationByAccountIdRepositoryStub)
  })

  const makeFakeFullApprenticeDetails = (): ApprenticeModel => ({
    _id: 'valid_id',
    accountId: 'valid_account_id',
    trade: 'Plumbing',
    advisor: 'John Doe',
    induction: true,
    assessment: true,
    updatedAt: new Date()
  })

  const makeFakeApprenticeDetails = (): ApprenticeDetailsModel => ({
    trade: 'Plumbing',
    advisor: 'John Doe',
    induction: true,
    assessment: true
  })

  test('should call LoadApprenticeInformationByAccountIdRepository with correct value', async () => {
    const loadSpy = jest.spyOn(loadApprenticeInformationByAccountIdRepositoryStub, 'loadById')
    await sut.loadApprenticeDetails('valid_account_id')
    expect(loadSpy).toHaveBeenCalledWith('valid_account_id')
  })

  test('should return apprentice details on success', async () => {
    const fakeFullApprenticeDetails = makeFakeFullApprenticeDetails()
    loadApprenticeInformationByAccountIdRepositoryStub.loadById.mockResolvedValueOnce(fakeFullApprenticeDetails)
    const apprenticeDetails = await sut.loadApprenticeDetails('valid_account_id')
    expect(apprenticeDetails).toEqual(makeFakeApprenticeDetails())
  })

  test('should return null if LoadApprenticeInformationByAccountIdRepository returns null', async () => {
    jest.spyOn(loadApprenticeInformationByAccountIdRepositoryStub, 'loadById').mockResolvedValueOnce(null)
    const apprenticeDetails = await sut.loadApprenticeDetails('valid_account_id')
    expect(apprenticeDetails).toBeNull()
  })

  test('should throw if LoadApprenticeInformationByAccountIdRepository throws', async () => {
    loadApprenticeInformationByAccountIdRepositoryStub.loadById.mockRejectedValueOnce(new Error('any_error'))
    await expect(sut.loadApprenticeDetails('valid_account_id')).rejects.toThrow('any_error')
  })
})
