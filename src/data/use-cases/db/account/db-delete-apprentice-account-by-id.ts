import { DeleteAccountByIdRepository } from '@/data/protocols/db/delete-account-by-id-repository'
import { DeleteApprenticeInformationByAccountIdRepository } from '@/data/protocols/db/delete-apprentice-information-by-account-id-repository'
import { TransactionManager } from '@/data/protocols/transaction/transaction-manager'
import { DeleteAccountById } from '@/domain/use-cases/delete-account-by-id'

export class DbDeleteApprenticeAccountById implements DeleteAccountById {
  constructor (
        private readonly transactionManager: TransactionManager,
        private readonly deleteAccountByIdRepository: DeleteAccountByIdRepository,
        private readonly deleteApprenticeInformationByAccountIdRepository: DeleteApprenticeInformationByAccountIdRepository
  ) {
    this.transactionManager = transactionManager
    this.deleteAccountByIdRepository = deleteAccountByIdRepository
    this.deleteApprenticeInformationByAccountIdRepository = deleteApprenticeInformationByAccountIdRepository
  }

  async deleteById (accountId: string): Promise<boolean> {
    return await this.transactionManager.executeTransaction(async (session) => {
      const deleteAccountResult = await this.deleteAccountByIdRepository.deleteById(accountId, { session })
      return !deleteAccountResult ? false : await this.deleteApprenticeInformationByAccountIdRepository.deleteById(accountId, { session })
    })
  }
}
