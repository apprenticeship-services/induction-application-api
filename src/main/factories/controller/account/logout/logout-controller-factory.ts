import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository'
import { LogControllerDecorator } from '@/main/decorators/log/log-controller-decorator'
import { LogoutController } from '@/presentation/controllers/account/logout/logout-controller'
import { Controller } from '@/presentation/protocols'

export const logoutControllerFactory = (): Controller => {
  return new LogControllerDecorator(new LogoutController(), new LogMongoRepository())
}
