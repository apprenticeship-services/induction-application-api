import { Decrypter } from '@/data/protocols/cryptography/decrypter'
import { LoadAccountByIdRepository } from '@/data/protocols/db/load-account-by-id-repository'
import { AccountModel } from '@/domain/models/account'
import { LoadAccountByToken } from '@/domain/use-cases/load-account-by-token'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly decrypter: Decrypter,
      private readonly loadAccountByIdRepository: LoadAccountByIdRepository
  ) {
    this.decrypter = decrypter
    this.loadAccountByIdRepository = loadAccountByIdRepository
  }

  async loadByToken (token: string, rolePermission: string): Promise<AccountModel> {
    const accountCredentials = await this.decrypter.decrypt(token)
    if (accountCredentials?._id &&
        accountCredentials?.role &&
        accountCredentials?.role === rolePermission
    ) {
      const account = await this.loadAccountByIdRepository.loadById(accountCredentials._id)
      if (account) {
        return account
      }
    }
    return null
  }
}
