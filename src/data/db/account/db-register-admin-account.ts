import { RegisterAccountRepository } from '@/data/protocols/db/register-account-repository'
import { AccountModel } from '@/domain/models/account'
import { RegisterAccount, RegisterAccountParams } from '@/domain/use-cases/register-account'

export class DbRegisterAdminAccount implements RegisterAccount {
  constructor (private readonly registerAccountRepository: RegisterAccountRepository) {
    this.registerAccountRepository = registerAccountRepository
  }

  async register (credentials: RegisterAccountParams): Promise<AccountModel> {
    const account = await this.registerAccountRepository.register(credentials)
    return null
  }
}
