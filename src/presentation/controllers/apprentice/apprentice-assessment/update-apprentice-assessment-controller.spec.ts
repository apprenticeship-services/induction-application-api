import { UpdateApprenticeAssessment } from '@/domain/use-cases/update-apprentice-assessment'
import { ApprenticeModel } from '@/domain/models/apprentice-model'
import { HttpRequest } from '@/presentation/protocols'
import { badRequest, forbidden, noContent, notFound, serverError } from '@/presentation/helpers/http-helper'
import { LoadApprenticeInformationByAccountId } from '@/domain/use-cases/load-apprentice-information-by-account-id'
import { ApprenticeNotFoundError } from '@/presentation/errors/apprentice-not-found-error'
import { UpdateApprenticeAssessmentController } from './update-apprentice-assessment-controller'
import { Validator } from '@/presentation/protocols/validator'
import { InvalidAssessmentRequestError } from '@/presentation/errors/invalid-assessment-request-error'

type Sut = {
  sut: UpdateApprenticeAssessmentController,
  loadApprenticeInformationByAccountIdStub: LoadApprenticeInformationByAccountId,
  updateApprenticeAssessment: UpdateApprenticeAssessment,
  validatorStub: Validator
}

const makeSut = (): Sut => {
  const validatorStub = makeValidatorStub()
  const loadApprenticeInformationByAccountIdStub = makeLoadApprenticeInformationByAccountId()
  const updateApprenticeAssessment = makeUpdateApprenticeAssessmentStub()
  const sut = new UpdateApprenticeAssessmentController(validatorStub, loadApprenticeInformationByAccountIdStub, updateApprenticeAssessment)
  return {
    sut,
    loadApprenticeInformationByAccountIdStub,
    updateApprenticeAssessment,
    validatorStub
  }
}

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: object): Error {
      return null
    }
  }
  return new ValidatorStub()
}

const makeUpdateApprenticeAssessmentStub = (): UpdateApprenticeAssessment => {
  class UpdateApprenticeAssessmentStub implements UpdateApprenticeAssessment {
    async updateAssessment (accountId: string): Promise<void> {
      return Promise.resolve(null)
    }
  }
  return new UpdateApprenticeAssessmentStub()
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
  induction: true,
  assessment: false,
  updatedAt: new Date()
})

const fakeAccountId = (): string => 'any_id'

const fakeRequest = (): HttpRequest => ({
  accountId: 'any_id'
})

describe('UpdateApprenticeAssessmentController', () => {
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

  test('Should return 403 if apprentice induction is false', async () => {
    const { sut, loadApprenticeInformationByAccountIdStub } = makeSut()
    const apprenticeWithInductionNotCompleted = { ...fakeApprenticeModel(), induction: false }
    jest.spyOn(loadApprenticeInformationByAccountIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(apprenticeWithInductionNotCompleted))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(forbidden(new InvalidAssessmentRequestError()))
  })

  test('Should return 400 if validator fails', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new Error())
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(badRequest(new Error()))
  })

  test('Should return 204 if apprentice already completed assessment before', async () => {
    const { sut, loadApprenticeInformationByAccountIdStub } = makeSut()
    const apprenticeWithTaskCompleted = { ...fakeApprenticeModel(), assessment: true }
    jest.spyOn(loadApprenticeInformationByAccountIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(apprenticeWithTaskCompleted))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(noContent())
  })

  test('Should call UpdateApprenticeAssessment with correct id', async () => {
    const { sut, updateApprenticeAssessment } = makeSut()
    const updateSpy = jest.spyOn(updateApprenticeAssessment, 'updateAssessment')
    await sut.handle(fakeRequest())
    expect(updateSpy).toHaveBeenCalledWith(fakeAccountId())
  })

  test('Should throw if UpdateApprenticeAssessment throws ', async () => {
    const { sut, updateApprenticeAssessment } = makeSut()
    jest.spyOn(updateApprenticeAssessment, 'updateAssessment').mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(noContent())
  })
})
