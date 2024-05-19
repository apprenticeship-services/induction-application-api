import { DeleteAccountByIdRepository } from '@/data/protocols/db/delete-account-by-id-repository'
import { DeleteAccount } from '@/domain/use-cases/delete-account-by-id'

export class DbDeleteAdminAccountById implements DeleteAccount {
  constructor (private readonly deleteAccountByIdRepository: DeleteAccountByIdRepository) {
    this.deleteAccountByIdRepository = deleteAccountByIdRepository
  }

  async deleteById (accountId: string): Promise<boolean> {
    return await this.deleteAccountByIdRepository.deleteById(accountId)
  }
}
