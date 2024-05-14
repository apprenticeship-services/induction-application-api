import { RegisterAccountRepository } from '@/data/protocols/db/register-account-repository'
import { AccountModel } from '@/domain/models/account'
import { RegisterAccount, RegisterAccountParams } from '@/domain/use-cases/register-account'
import { Generator } from '@/data/protocols/generator/generator'
import { Hasher } from '@/data/protocols/cryptography/hasher'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-by-email-repository'
import { RegistrationEmailService } from '@/data/protocols/email/registration-email-service'

export class DbRegisterAdminAccount implements RegisterAccount {
  private readonly role = 'admin'
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly passwordGenerator: Generator,
    private readonly hasher: Hasher,
    private readonly registerAccountRepository: RegisterAccountRepository,
    private readonly registrationEmailService: RegistrationEmailService
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.passwordGenerator = passwordGenerator
    this.hasher = hasher
    this.registerAccountRepository = registerAccountRepository
    this.registrationEmailService = registrationEmailService
  }

  async register (credentials: RegisterAccountParams): Promise<AccountModel> {
    const isAccount = await this.loadAccountByEmailRepository.loadByEmail(credentials.email)
    if (isAccount) {
      return null
    }
    const password = this.passwordGenerator.generate()
    const hashedPassword = await this.hasher.hash(password)
    const account = await this.registerAccountRepository.register({
      ...credentials,
      password: hashedPassword,
      role: this.role,
      createdAt: new Date()
    })

    await this.registrationEmailService.sendRegistrationMail({
      emailTo: account.email,
      password,
      role: account.role
    })
    return account
  }
}
