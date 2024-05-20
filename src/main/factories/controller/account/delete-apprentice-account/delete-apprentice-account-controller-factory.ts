import { DbDeleteApprenticeAccountById } from '@/data/use-cases/db/account/db-delete-apprentice-account-by-id'
import { DbLoadAccountById } from '@/data/use-cases/db/account/db-load-account-by-id'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { ApprenticeMongoRepository } from '@/infra/db/mongodb/apprentice/apprentice-mongo-repository'
import { MongoDbTransactionManager } from '@/infra/db/mongodb/transaction/mongodb-transaction-manager'
import { IdParamValidatorAdapter } from '@/infra/validator/id-param-validator-adapter/mongodb/id-param-validator'
import { DeleteApprenticeController } from '@/presentation/controllers/account/apprentices/delete-apprentice-account-controller'
import { Controller } from '@/presentation/protocols'
import { IdParamValidation } from '@/validator/validators/id-param-validator'

export const deleteApprenticeControllerFactory = (): Controller => {
  const idParamValidator = new IdParamValidation('id', new IdParamValidatorAdapter())
  const loadAccountByIdRepository = new AccountMongoRepository()
  const loadAccountById = new DbLoadAccountById(loadAccountByIdRepository)
  const transactionManager = new MongoDbTransactionManager()
  const deleteAccountByIdRepository = new AccountMongoRepository()
  const deleteApprenticeAccountByIdRepository = new ApprenticeMongoRepository()
  const deleteApprenticeAccountById = new DbDeleteApprenticeAccountById(transactionManager, deleteAccountByIdRepository, deleteApprenticeAccountByIdRepository)
  return new DeleteApprenticeController(idParamValidator, loadAccountById, deleteApprenticeAccountById)
}
