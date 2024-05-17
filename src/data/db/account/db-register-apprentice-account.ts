import { Hasher } from '@/data/protocols/cryptography/hasher'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-by-email-repository'
import { RegisterAccountRepository } from '@/data/protocols/db/register-account-repository'
import { RegistrationEmailService } from '@/data/protocols/email/registration-email-service'
import { AccountModel } from '@/domain/models/account'
import { RegisterApprenticeAccount, RegisterApprenticeAccountParams } from '@/domain/use-cases/register-apprentice-account'
import { Generator } from '@/data/protocols/generator/generator'
import { RegisterApprenticeInformationRepository } from '@/data/protocols/db/register-apprentice-induction-information'

export class DbRegisterApprenticeAccount implements RegisterApprenticeAccount {
  private readonly role = 'apprentice'
  constructor (
      private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
      private readonly passwordGenerator: Generator,
      private readonly hasher: Hasher,
      private readonly registerAccountRepository: RegisterAccountRepository,
      private readonly registerApprenticeInformationRepository: RegisterApprenticeInformationRepository,
      private readonly registrationEmailService: RegistrationEmailService
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.passwordGenerator = passwordGenerator
    this.hasher = hasher
    this.registerAccountRepository = registerAccountRepository
    this.registrationEmailService = registrationEmailService
  }

  async register (apprenticeInformation:RegisterApprenticeAccountParams): Promise<AccountModel> {
    const isAccount = await this.loadAccountByEmailRepository.loadByEmail(apprenticeInformation.email)
    if (isAccount) {
      return null
    }
    const password = this.passwordGenerator.generate()
    return null
  }
}
