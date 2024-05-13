import { RegisterAccountRepository } from '@/data/protocols/db/register-account-repository'
import { AccountModel } from '@/domain/models/account'
import { RegisterAccount, RegisterAccountParams } from '@/domain/use-cases/register-account'
import { Generator } from '@/data/protocols/cryptography/generator'
import { Hasher } from '@/data/protocols/cryptography/hasher'

export class DbRegisterAdminAccount implements RegisterAccount {
  private readonly role = 'admin'
  constructor (
    private readonly passwordGenerator: Generator,
    private readonly hasher: Hasher,
    private readonly registerAccountRepository: RegisterAccountRepository
  ) {
    this.passwordGenerator = passwordGenerator
    this.hasher = hasher
    this.registerAccountRepository = registerAccountRepository
  }

  async register (credentials: RegisterAccountParams): Promise<AccountModel> {
    const password = this.passwordGenerator.generate()
    const hashedPassword = await this.hasher.hash(password)
    const account = await this.registerAccountRepository.register({ ...credentials, password: hashedPassword, role: this.role })
    return null
  }
}
