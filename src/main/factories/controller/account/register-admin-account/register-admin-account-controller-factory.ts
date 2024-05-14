import { DbRegisterAdminAccount } from '@/data/db/account/db-register-admin-account'
import { RegisterAdminAccountController } from '@/presentation/controllers/account/register-admin-controller'
import { Controller } from '@/presentation/protocols'
import { registerAdminAccountValidatorFactory } from './register-admin-account-validator-factory'
import { PasswordGenerator } from '@/infra/generator/password-generator/password-generator'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'

export const registerAdminAccountControllerFactory = (): Controller => {
  const loadAccountByEmailRepository = new AccountMongoRepository()
  const registerAccountRepository = new AccountMongoRepository()
  const passwordGenerator = new PasswordGenerator()
  const hasher = new BcryptAdapter()
  const registerAdminAccountUseCase = new DbRegisterAdminAccount(loadAccountByEmailRepository, passwordGenerator, hasher, registerAccountRepository)
  const validators = registerAdminAccountValidatorFactory()
  return new RegisterAdminAccountController(registerAdminAccountUseCase, validators)
}
