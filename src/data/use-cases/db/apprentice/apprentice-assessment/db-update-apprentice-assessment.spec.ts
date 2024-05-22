import MockDate from 'mockdate'
import { DbUpdateApprenticeAssessment } from './db-update-apprentice-assessment'
import { UpdateApprenticeAssessmentRepository, UpdateApprenticeAssessmentRepositoryParams } from '@/data/protocols/db/update-apprentice-assessment-repository'

type Sut = {
  sut: DbUpdateApprenticeAssessment,
  updateApprenticeAssessmentRepositoryStub: UpdateApprenticeAssessmentRepository
}

const makeSut = (): Sut => {
  const updateApprenticeAssessmentRepositoryStub = makeUpdateApprenticeAssessmentRepositoryStub()
  const sut = new DbUpdateApprenticeAssessment(updateApprenticeAssessmentRepositoryStub)
  return {
    sut,
    updateApprenticeAssessmentRepositoryStub
  }
}

const makeUpdateApprenticeAssessmentRepositoryStub = (): UpdateApprenticeAssessmentRepository => {
  class UpdateApprenticeAssessmentRepositoryStub implements UpdateApprenticeAssessmentRepository {
    updateAssessment (data: UpdateApprenticeAssessmentRepositoryParams): Promise<void> {
      return Promise.resolve()
    }
  }
  return new UpdateApprenticeAssessmentRepositoryStub()
}

const fakeAccountId = 'any_accountId'

const fakeUpdateAssessmentData = (): UpdateApprenticeAssessmentRepositoryParams => ({
  accountId: 'any_accountId',
  updatedAt: new Date()
})

describe('DbUpdateApprenticeAssessment', () => {
  beforeEach(() => MockDate.set(new Date()))
  afterEach(() => MockDate.reset())
  test('Should call UpdateApprenticeAssessmentRepository with correct values', async () => {
    const { sut, updateApprenticeAssessmentRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateApprenticeAssessmentRepositoryStub, 'updateAssessment')
    await sut.updateAssessment(fakeAccountId)
    expect(updateSpy).toHaveBeenCalledWith(fakeUpdateAssessmentData())
  })

  test('Should throw if UpdateApprenticeAssessmentRepository throws', async () => {
    const { sut, updateApprenticeAssessmentRepositoryStub } = makeSut()
    jest.spyOn(updateApprenticeAssessmentRepositoryStub, 'updateAssessment').mockReturnValueOnce(Promise.reject(new Error()))
    const updateResult = sut.updateAssessment(fakeAccountId)
    await expect(updateResult).rejects.toThrow()
  })

  test('Should returns void on success', async () => {
    const { sut } = makeSut()
    const updateResult = await sut.updateAssessment(fakeAccountId)
    expect(updateResult).toBeUndefined()
  })
})
