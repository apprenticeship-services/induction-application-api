import { RegisterAccountRepository } from '@/data/protocols/db/register-account-repository'
import { AccountModel } from '@/domain/models/account'
import { RegisterAccount, RegisterAccountParams } from '@/domain/use-cases/register-account'
import { Generator } from '@/data/protocols/cryptography/generator'

export class DbRegisterAdminAccount implements RegisterAccount {
  private readonly role = 'admin'
  constructor (
    private readonly registerAccountRepository: RegisterAccountRepository,
    private readonly passwordGenerator: Generator) {
    this.registerAccountRepository = registerAccountRepository
    this.passwordGenerator = passwordGenerator
  }

  async register (credentials: RegisterAccountParams): Promise<AccountModel> {
    const password = this.passwordGenerator.generate()
    const account = await this.registerAccountRepository.register({ ...credentials, password, role: this.role })
    return null
  }
}
