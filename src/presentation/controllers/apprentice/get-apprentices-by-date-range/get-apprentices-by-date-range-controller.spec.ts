import { Validator } from '@/presentation/protocols/validator'
import { GetApprenticesByDateRangeController } from './get-apprentices-by-date-range-controller'
import { ApprenticeInformationModel, LoadApprenticesByDateRange } from '@/domain/use-cases/load-apprentices-by-date-range'
import { HttpRequest } from '@/presentation/protocols'
import { InvalidParamError } from '@/presentation/errors/invalid-params'
import { badRequest, serverError, success } from '@/presentation/helpers/http-helper'
import MockDate from 'mockdate'

type Sut = {
    sut: GetApprenticesByDateRangeController,
    validatorStub: Validator,
    loadApprenticesByDateRangeStub: LoadApprenticesByDateRange
}

const makeSut = (): Sut => {
  const validatorStub = makeValidatorStub()
  const loadApprenticesByDateRangeStub = makeLoadApprenticesByDateRangeStub()
  const sut = new GetApprenticesByDateRangeController(validatorStub, loadApprenticesByDateRangeStub)
  return {
    sut,
    validatorStub,
    loadApprenticesByDateRangeStub
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

const makeLoadApprenticesByDateRangeStub = (): LoadApprenticesByDateRange => {
  class LoadApprenticesByDateRangeStub implements LoadApprenticesByDateRange {
    async loadByDateRange (startDate: Date, endDate: Date): Promise<ApprenticeInformationModel[]> {
      return Promise.resolve(fakeApprenticeInfoModelArray())
    }
  }
  return new LoadApprenticesByDateRangeStub()
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

const startDate = new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
const endDate = new Date()

const fakeRequest = (): HttpRequest => ({
  query: {
    startDate,
    endDate
  }
})

describe('GetApprenticesByDateRangeController', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())
  test('Should call Validator with valid request body', async () => {
    const { sut, validatorStub } = makeSut()
    const validatorSpy = jest.spyOn(validatorStub, 'validate')
    await sut.handle(fakeRequest())
    expect(validatorSpy).toHaveBeenCalledWith(fakeRequest().query)
  })

  test('Should return 400 if Validator returns error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new InvalidParamError('startDate'))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(badRequest(new InvalidParamError('startDate')))
  })

  test('Should call LoadApprenticesByDateRange with valid start and end date', async () => {
    const { sut, loadApprenticesByDateRangeStub } = makeSut()
    const loadApprenticesSpy = jest.spyOn(loadApprenticesByDateRangeStub, 'loadByDateRange')
    await sut.handle(fakeRequest())
    expect(loadApprenticesSpy).toHaveBeenCalledWith(startDate, endDate)
  })

  test('Should return 200 with empty array if LoadApprenticesByDateRange returns empty', async () => {
    const { sut, loadApprenticesByDateRangeStub } = makeSut()
    jest.spyOn(loadApprenticesByDateRangeStub, 'loadByDateRange').mockReturnValueOnce(Promise.resolve([]))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(success([]))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(success(fakeApprenticeInfoModelArray()))
    expect(response.body.length).toBe(2)
  })

  test('Should return 500 if LoadApprenticesByDateRange fails', async () => {
    const { sut, loadApprenticesByDateRangeStub } = makeSut()
    jest.spyOn(loadApprenticesByDateRangeStub, 'loadByDateRange').mockImplementationOnce(async () => {
      throw new Error()
    })
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })
})
