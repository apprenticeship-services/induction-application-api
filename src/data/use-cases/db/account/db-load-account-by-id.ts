import { LoadAccountByIdRepository } from '@/data/protocols/db/load-account-by-id-repository'
import { AccountModel } from '@/domain/models/account'
import { LoadAccountById } from '@/domain/use-cases/load-account-by-id'

export class DbLoadAccountById implements LoadAccountById {
  constructor (private readonly loadAccountByIdRepository: LoadAccountByIdRepository) {
    this.loadAccountByIdRepository = loadAccountByIdRepository
  }

  async loadById (accountId: string): Promise<AccountModel> {
    return await this.loadAccountByIdRepository.loadById(accountId)
  }
}
