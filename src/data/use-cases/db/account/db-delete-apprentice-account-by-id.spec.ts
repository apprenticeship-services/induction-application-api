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
  test('Should call TransactionManager with correct transaction', async () => {
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
})
