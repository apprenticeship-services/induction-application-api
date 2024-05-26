import { Controller } from '@/presentation/protocols'
import { registerApprenticeAccountValidatorFactory } from './register-apprentice-account-validator-factory'
import { PasswordGenerator } from '@/infra/generator/password-generator/password-generator'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { EmailServiceAdapter } from '@/infra/email/nodemailer/email-service/email-service-adapter'
import { TemplateEmailGenerator } from '@/infra/email/nodemailer/template-generator/template-email-generator'
import { DbRegisterApprenticeAccount } from '@/data/use-cases/db/account/db-register-apprentice-account'
import { ApprenticeMongoRepository } from '@/infra/db/mongodb/apprentice/apprentice-mongo-repository'
import { RegisterApprenticeController } from '@/presentation/controllers/account/apprentices/register-apprentice-controller'
import { MongoDbTransactionManager } from '@/infra/db/mongodb/transaction/mongodb-transaction-manager'
import { LogControllerDecorator } from '@/main/decorators/log/log-controller-decorator'
import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository'

export const registerApprenticeAccountControllerFactory = (): Controller => {
  const loadAccountByEmailRepository = new AccountMongoRepository()
  const passwordGenerator = new PasswordGenerator()
  const hasher = new BcryptAdapter()
  const transactionManager = new MongoDbTransactionManager()
  const registerApprenticeInformationRepository = new ApprenticeMongoRepository()
  const registerAccountRepository = new AccountMongoRepository()
  const templateGenerator = new TemplateEmailGenerator()
  const registrationEmailService = new EmailServiceAdapter(templateGenerator)
  const registerApprenticeAccountUseCase = new DbRegisterApprenticeAccount(loadAccountByEmailRepository, passwordGenerator, hasher, transactionManager, registerAccountRepository, registerApprenticeInformationRepository, registrationEmailService)
  const validators = registerApprenticeAccountValidatorFactory()
  return new LogControllerDecorator(new RegisterApprenticeController(validators, registerApprenticeAccountUseCase), new LogMongoRepository())
}
