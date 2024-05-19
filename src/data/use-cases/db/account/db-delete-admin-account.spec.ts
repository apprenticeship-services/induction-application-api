import { DeleteAccountByIdRepository } from '@/data/protocols/db/delete-account-by-id-repository'
import { DbDeleteAdminAccountById } from './db-delete-admin-account'

type Sut = {
    sut: DbDeleteAdminAccountById,
    deleteAccountByIdRepository: DeleteAccountByIdRepository
}

const makeSut = (): Sut => {
  const deleteAccountByIdRepository = makeDeleteAccountRepositoryStub()
  const sut = new DbDeleteAdminAccountById(deleteAccountByIdRepository)
  return {
    sut,
    deleteAccountByIdRepository
  }
}

const makeDeleteAccountRepositoryStub = (): DeleteAccountByIdRepository => {
  class DeleteAccountByIdRepositoryStub implements DeleteAccountByIdRepository {
    deleteById (accountId: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new DeleteAccountByIdRepositoryStub()
}

const fakeAccountId = ():string => 'any_id'

describe('Delete Admin Account', () => {
  test('Should call DeleteAccountByIdRepository with correct value', async () => {
    const { sut, deleteAccountByIdRepository } = makeSut()
    const deleteSpy = jest.spyOn(deleteAccountByIdRepository, 'deleteById')
    await sut.deleteById(fakeAccountId())
    expect(deleteSpy).toHaveBeenCalledWith(fakeAccountId())
  })

  test('Should throw if DeleteAccountByIdRepository throws', async () => {
    const { sut, deleteAccountByIdRepository } = makeSut()
    jest.spyOn(deleteAccountByIdRepository, 'deleteById').mockReturnValueOnce(Promise.reject(new Error()))
    const result = sut.deleteById(fakeAccountId())
    expect(result).rejects.toThrow()
  })

  test('Should return false if DeleteAccountByIdRepository returns false', async () => {
    const { sut, deleteAccountByIdRepository } = makeSut()
    jest.spyOn(deleteAccountByIdRepository, 'deleteById').mockReturnValueOnce(Promise.resolve(false))
    const result = await sut.deleteById(fakeAccountId())
    expect(result).toBe(false)
  })
})
