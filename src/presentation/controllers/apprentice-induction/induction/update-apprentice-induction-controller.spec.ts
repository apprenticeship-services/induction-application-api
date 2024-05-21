import { UpdateApprenticeInduction } from '@/domain/use-cases/update-apprentice-induction'
import { UpdateApprenticeInductionController } from './update-apprentice-induction-controller'
import { ApprenticeModel } from '@/domain/models/apprentice-model'
import { HttpRequest } from '@/presentation/protocols'
import { noContent, notFound, serverError } from '@/presentation/helpers/http-helper'
import { LoadApprenticeInformationByAccountId } from '@/domain/use-cases/load-apprentice-information-by-account-id'
import { ApprenticeNotFoundError } from '@/presentation/errors/apprentice-not-found-error'

type Sut = {
  sut: UpdateApprenticeInductionController,
  loadApprenticeInformationByAccountIdStub: LoadApprenticeInformationByAccountId,
  updateApprenticeInductionStub: UpdateApprenticeInduction
}

const makeSut = (): Sut => {
  const loadApprenticeInformationByAccountIdStub = makeLoadApprenticeInformationByAccountId()
  const updateApprenticeInductionStub = makeUpdateApprenticeInductionStub()
  const sut = new UpdateApprenticeInductionController(loadApprenticeInformationByAccountIdStub, updateApprenticeInductionStub)
  return {
    sut,
    loadApprenticeInformationByAccountIdStub,
    updateApprenticeInductionStub
  }
}

const makeUpdateApprenticeInductionStub = (): UpdateApprenticeInduction => {
  class UpdateApprenticeInductionStub implements UpdateApprenticeInduction {
    async updateInduction (accountId: string): Promise<void> {
      return Promise.resolve(null)
    }
  }
  return new UpdateApprenticeInductionStub()
}

const makeLoadApprenticeInformationByAccountId = (): LoadApprenticeInformationByAccountId => {
  class LoadApprenticeInformationByAccountIdStub implements LoadApprenticeInformationByAccountId {
    async loadById (account: string): Promise<ApprenticeModel> {
      return Promise.resolve(fakeApprenticeModel())
    }
  }
  return new LoadApprenticeInformationByAccountIdStub()
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

const fakeAccountId = (): string => 'any_id'

const fakeRequest = (): HttpRequest => ({
  accountId: 'any_id'
})

describe('UpdateApprenticeInductionController', () => {
  test('Should call LoadApprenticeInformationByAccountId with correct id', async () => {
    const { sut, loadApprenticeInformationByAccountIdStub } = makeSut()
    const updateSpy = jest.spyOn(loadApprenticeInformationByAccountIdStub, 'loadById')
    await sut.handle(fakeRequest())
    expect(updateSpy).toHaveBeenCalledWith(fakeAccountId())
  })

  test('Should throw if LoadApprenticeInformationByAccountId throws ', async () => {
    const { sut, loadApprenticeInformationByAccountIdStub } = makeSut()
    jest.spyOn(loadApprenticeInformationByAccountIdStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 404 if LoadApprenticeInformationByAccountId does not find an apprentice account', async () => {
    const { sut, loadApprenticeInformationByAccountIdStub } = makeSut()
    jest.spyOn(loadApprenticeInformationByAccountIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(notFound(new ApprenticeNotFoundError()))
  })

  test('Should return 204 if apprentice already completed induction before', async () => {
    const { sut, loadApprenticeInformationByAccountIdStub } = makeSut()
    const apprenticeWithTaskCompleted = { ...fakeApprenticeModel(), induction: true }
    jest.spyOn(loadApprenticeInformationByAccountIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(apprenticeWithTaskCompleted))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(noContent())
  })

  test('Should call UpdateApprenticeInduction with correct id', async () => {
    const { sut, updateApprenticeInductionStub } = makeSut()
    const updateSpy = jest.spyOn(updateApprenticeInductionStub, 'updateInduction')
    await sut.handle(fakeRequest())
    expect(updateSpy).toHaveBeenCalledWith(fakeAccountId())
  })

  test('Should throw if UpdateApprenticeInduction throws ', async () => {
    const { sut, updateApprenticeInductionStub } = makeSut()
    jest.spyOn(updateApprenticeInductionStub, 'updateInduction').mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 204 on success ', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(noContent())
  })
})
