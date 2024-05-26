import { DbDeleteAdminAccountById } from '@/data/use-cases/db/account/db-delete-admin-account'
import { DbLoadAccountById } from '@/data/use-cases/db/account/db-load-account-by-id'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository'
import { IdParamValidatorAdapter } from '@/infra/validator/id-param-validator-adapter/mongodb/id-param-validator'
import { LogControllerDecorator } from '@/main/decorators/log/log-controller-decorator'
import { DeleteAdminController } from '@/presentation/controllers/account/admins/delete-admin-controller'
import { Controller } from '@/presentation/protocols'
import { IdParamValidation } from '@/validator/validators/id-param-validator'

export const deleteAdminControllerFactory = (): Controller => {
  const idParamValidator = new IdParamValidation('id', new IdParamValidatorAdapter())
  const loadAccountByIdRepository = new AccountMongoRepository()
  const loadAccountById = new DbLoadAccountById(loadAccountByIdRepository)
  const deleteAccountByIdRepository = new AccountMongoRepository()
  const deleteAccountById = new DbDeleteAdminAccountById(deleteAccountByIdRepository)
  return new LogControllerDecorator(new DeleteAdminController(idParamValidator, loadAccountById, deleteAccountById), new LogMongoRepository())
}
