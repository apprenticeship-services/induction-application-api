import { DeleteAccountById } from '@/domain/use-cases/delete-account-by-id'
import { DbDeleteApprenticeAccountById } from './db-delete-apprentice-account-by-id'
import { DeleteApprenticeInformationByAccountIdRepository } from '@/data/protocols/db/delete-apprentice-information-by-account-id-repository'
import { TransactionManager } from '@/data/protocols/transaction/transaction-manager'

type Sut = {
    sut: DbDeleteApprenticeAccountById,
    transactionManagerStub: TransactionManager
    deleteAccountByIdRepositoryStub: DeleteAccountById
    deleteApprenticeInformationByAccountIdRepositoryStub: DeleteApprenticeInformationByAccountIdRepository
}
const makeSut = (): Sut => {
  const transactionManagerStub = makeTransactionManagerStub()
  const deleteAccountByIdRepositoryStub = makeDeleteAccountByIdRepositoryStub()
  const deleteApprenticeInformationByAccountIdRepositoryStub = makeDeleteApprenticeInformationByAccountIdRepositoryStub()
  const sut = new DbDeleteApprenticeAccountById(transactionManagerStub, deleteAccountByIdRepositoryStub, deleteApprenticeInformationByAccountIdRepositoryStub)
  return {
    sut,
    transactionManagerStub,
    deleteAccountByIdRepositoryStub,
    deleteApprenticeInformationByAccountIdRepositoryStub
  }
}

const makeTransactionManagerStub = (): TransactionManager => {
  class TransactionManagerStub implements TransactionManager {
    async executeTransaction<T> (transaction: (session?: any) => Promise<T>): Promise<T> {
      const session = {}
      return transaction(session)
    }
  }
  return new TransactionManagerStub()
}

const makeDeleteAccountByIdRepositoryStub = (): DeleteAccountById => {
  class DeleteAccountByIdStub implements DeleteAccountById {
    deleteById (accountId: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new DeleteAccountByIdStub()
}

const makeDeleteApprenticeInformationByAccountIdRepositoryStub = (): DeleteApprenticeInformationByAccountIdRepository => {
  class DeleteApprenticeInformationByAccountIdRepositoryStub implements DeleteApprenticeInformationByAccountIdRepository {
    deleteById (accountId: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new DeleteApprenticeInformationByAccountIdRepositoryStub()
}

const session = {}
describe('DbDeleteApprenticeAccountById', () => {
  test('Should call TransactionManager with correct callback function', async () => {
    const {
      sut,
      transactionManagerStub,
      deleteAccountByIdRepositoryStub,
      deleteApprenticeInformationByAccountIdRepositoryStub
    } = makeSut()
    const executeTransactionSpy = jest.spyOn(transactionManagerStub, 'executeTransaction')
    await sut.deleteById('any_id')

    expect(executeTransactionSpy).toHaveBeenCalled()

    const deleteAccountByIdSpy = jest.spyOn(deleteAccountByIdRepositoryStub, 'deleteById')
    const deleteApprenticeInfoSpy = jest.spyOn(deleteApprenticeInformationByAccountIdRepositoryStub, 'deleteById')

    await executeTransactionSpy.mock.calls[0][0](session)

    expect(deleteAccountByIdSpy).toHaveBeenCalledWith('any_id', { session })
    expect(deleteApprenticeInfoSpy).toHaveBeenCalledWith('any_id', { session })
  })

  test('Should throw if TransactionManager throws', async () => {
    const {
      sut,
      transactionManagerStub
    } = makeSut()
    jest.spyOn(transactionManagerStub, 'executeTransaction').mockReturnValueOnce(Promise.reject(new Error()))
    const deleteResult = sut.deleteById('any_id')
    await expect(deleteResult).rejects.toThrow()
  })

  test('Should call DeleteAccountByIdRepository with correct values', async () => {
    const {
      sut,
      deleteAccountByIdRepositoryStub
    } = makeSut()
    const deleteAccountSpy = jest.spyOn(deleteAccountByIdRepositoryStub, 'deleteById')
    await sut.deleteById('any_id')
    expect(deleteAccountSpy).toHaveBeenCalledWith('any_id', { session })
  })

  test('Should call throw if DeleteAccountByIdRepository throws ', async () => {
    const {
      sut,
      deleteAccountByIdRepositoryStub
    } = makeSut()
    jest.spyOn(deleteAccountByIdRepositoryStub, 'deleteById').mockReturnValueOnce(Promise.reject(new Error()))
    const deleteResult = sut.deleteById('any_id')
    await expect(deleteResult).rejects.toThrow()
  })

  test('Should call DeleteApprenticeInformationByAccountIdRepositoryStub with correct values', async () => {
    const {
      sut,
      deleteApprenticeInformationByAccountIdRepositoryStub
    } = makeSut()
    const deleteApprenticeInfoSpy = jest.spyOn(deleteApprenticeInformationByAccountIdRepositoryStub, 'deleteById')
    await sut.deleteById('any_id')
    expect(deleteApprenticeInfoSpy).toHaveBeenCalledWith('any_id', { session })
  })

  test('Should call throw if DeleteApprenticeInformationByAccountIdRepositoryStub throws ', async () => {
    const {
      sut,
      deleteApprenticeInformationByAccountIdRepositoryStub
    } = makeSut()
    jest.spyOn(deleteApprenticeInformationByAccountIdRepositoryStub, 'deleteById').mockReturnValueOnce(Promise.reject(new Error()))
    const deleteApprenticeInfoSpy = sut.deleteById('any_id')
    await expect(deleteApprenticeInfoSpy).rejects.toThrow()
  })

  test('Should return true on success', async () => {
    const {
      sut
    } = makeSut()
    const deleteByIdResult = await sut.deleteById('any_id')
    expect(deleteByIdResult).toBe(true)
  })
})
