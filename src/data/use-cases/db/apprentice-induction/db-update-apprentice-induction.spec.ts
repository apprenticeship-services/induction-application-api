import { UpdateApprenticeInductionRepository, UpdateApprenticeInductionRepositoryParams } from '@/data/protocols/db/update-apprentice-induction-repository'
import { DbUpdateApprenticeInduction } from './db-update-apprentice-induction'
import MockDate from 'mockdate'

type Sut = {
  sut: DbUpdateApprenticeInduction,
  updateApprenticeInductionRepositoryStub: UpdateApprenticeInductionRepository
}

const makeSut = (): Sut => {
  const updateApprenticeInductionRepositoryStub = makeUpdateApprenticeInductionRepositoryStub()
  const sut = new DbUpdateApprenticeInduction(updateApprenticeInductionRepositoryStub)
  return {
    sut,
    updateApprenticeInductionRepositoryStub
  }
}

const makeUpdateApprenticeInductionRepositoryStub = (): UpdateApprenticeInductionRepository => {
  class UpdateApprenticeInductionRepositoryStub implements UpdateApprenticeInductionRepository {
    updateInduction (data: UpdateApprenticeInductionRepositoryParams): Promise<void> {
      return Promise.resolve()
    }
  }
  return new UpdateApprenticeInductionRepositoryStub()
}

const fakeAccountId = 'any_accountId'

const fakeUpdateInductionData = (): UpdateApprenticeInductionRepositoryParams => ({
  accountId: 'any_accountId',
  updatedAt: new Date()
})

describe('DbUpdateApprenticeInduction', () => {
  beforeEach(() => MockDate.set(new Date()))
  afterEach(() => MockDate.reset())
  test('Should call UpdateApprenticeInductionRepository with correct values', async () => {
    const { sut, updateApprenticeInductionRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateApprenticeInductionRepositoryStub, 'updateInduction')
    await sut.updateInduction(fakeAccountId)
    expect(updateSpy).toHaveBeenCalledWith(fakeUpdateInductionData())
  })

  test('Should throw if UpdateApprenticeInductionRepository throws', async () => {
    const { sut, updateApprenticeInductionRepositoryStub } = makeSut()
    jest.spyOn(updateApprenticeInductionRepositoryStub, 'updateInduction').mockReturnValueOnce(Promise.reject(new Error()))
    const updateResult = sut.updateInduction(fakeAccountId)
    await expect(updateResult).rejects.toThrow()
  })

  test('Should returns void on success', async () => {
    const { sut } = makeSut()
    const updateResult = await sut.updateInduction(fakeAccountId)
    expect(updateResult).toBeUndefined()
  })
})
