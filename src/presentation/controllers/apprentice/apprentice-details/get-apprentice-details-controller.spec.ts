import { LoadApprenticeDetails } from '@/domain/use-cases/load-apprentice-details'
import { ApprenticeNotFoundError } from '@/presentation/errors/apprentice-not-found-error'
import { notFound, serverError, success } from '@/presentation/helpers/http-helper'
import { HttpRequest } from '@/presentation/protocols'
import { GetApprenticeDetailsController } from './get-apprentice-details-controller'
import { ApprenticeDetailsModel } from '@/domain/models/apprentice-details'

describe('GetApprenticeDetailsController', () => {
  let loadApprenticeDetailsStub: jest.Mocked<LoadApprenticeDetails>
  let sut: GetApprenticeDetailsController

  beforeEach(() => {
    loadApprenticeDetailsStub = {
      loadApprenticeDetails: jest.fn()
    }

    sut = new GetApprenticeDetailsController(loadApprenticeDetailsStub)
  })

  const makeFakeRequest = (): HttpRequest => ({
    accountId: 'valid_account_id'
  })

  const makeFakeApprenticeDetails = (): ApprenticeDetailsModel => ({
    advisor: 'valid_advisor',
    trade: 'valid_trade',
    induction: true,
    assessment: true
  })

  test('should call LoadApprenticeDetails with correct value', async () => {
    const loadSpy = jest.spyOn(loadApprenticeDetailsStub, 'loadApprenticeDetails')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('valid_account_id')
  })

  test('should return 404 if LoadApprenticeDetails returns null', async () => {
    loadApprenticeDetailsStub.loadApprenticeDetails.mockResolvedValueOnce(null)
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(notFound(new ApprenticeNotFoundError()))
  })

  test('should return 200 if LoadApprenticeDetails returns apprentice details', async () => {
    loadApprenticeDetailsStub.loadApprenticeDetails.mockResolvedValueOnce(makeFakeApprenticeDetails())
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(success(makeFakeApprenticeDetails()))
  })

  test('should return 500 if LoadApprenticeDetails throws', async () => {
    loadApprenticeDetailsStub.loadApprenticeDetails.mockRejectedValueOnce(new Error('any_error'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error('any_error')))
  })
})
