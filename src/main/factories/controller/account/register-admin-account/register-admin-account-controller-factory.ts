import { DbRegisterAdminAccount } from '@/data/db/account/db-register-admin-account'
import { Controller } from '@/presentation/protocols'
import { registerAdminAccountValidatorFactory } from './register-admin-account-validator-factory'
import { PasswordGenerator } from '@/infra/generator/password-generator/password-generator'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { EmailServiceAdapter } from '@/infra/email/nodemailer/email-service/email-service-adapter'
import { TemplateEmailGenerator } from '@/infra/email/nodemailer/template-generator/template-email-generator'
import { RegisterAdminAccountController } from '@/presentation/controllers/account/admins/register-admin-controller'

export const registerAdminAccountControllerFactory = (): Controller => {
  const loadAccountByEmailRepository = new AccountMongoRepository()
  const registerAccountRepository = new AccountMongoRepository()
  const passwordGenerator = new PasswordGenerator()
  const hasher = new BcryptAdapter()
  const templateGenerator = new TemplateEmailGenerator()
  const registrationEmailService = new EmailServiceAdapter(templateGenerator)
  const registerAdminAccountUseCase = new DbRegisterAdminAccount(loadAccountByEmailRepository, passwordGenerator, hasher, registerAccountRepository, registrationEmailService)
  const validators = registerAdminAccountValidatorFactory()
  return new RegisterAdminAccountController(registerAdminAccountUseCase, validators)
}
