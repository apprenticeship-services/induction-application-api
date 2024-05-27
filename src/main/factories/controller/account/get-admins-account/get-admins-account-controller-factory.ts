import { DbLoadAdminsAccount } from '@/data/use-cases/db/account/db-load-admins-account'
import { AdminsMongoRepository } from '@/infra/db/mongodb/admins/admins-mongo-repository'
import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository'
import { LogControllerDecorator } from '@/main/decorators/log/log-controller-decorator'
import { GetAdminsController } from '@/presentation/controllers/account/admins/get-admins-controller'
import { Controller } from '@/presentation/protocols'

export const getAdminsControllerFactory = (): Controller => {
  const loadAdminsRepository = new AdminsMongoRepository()
  const loadAdminsAccount = new DbLoadAdminsAccount(loadAdminsRepository)
  const logErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(new GetAdminsController(loadAdminsAccount), logErrorRepository)
}
