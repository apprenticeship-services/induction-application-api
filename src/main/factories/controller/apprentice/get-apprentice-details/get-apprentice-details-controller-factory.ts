import { DbLoadApprenticeDetails } from '@/data/use-cases/db/apprentice/apprentice-details/db-load-apprentice-details'
import { ApprenticeMongoRepository } from '@/infra/db/mongodb/apprentice/apprentice-mongo-repository'
import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository'
import { LogControllerDecorator } from '@/main/decorators/log/log-controller-decorator'
import { GetApprenticeDetailsController } from '@/presentation/controllers/apprentice/apprentice-details/get-apprentice-details-controller'
import { Controller } from '@/presentation/protocols'

export const getApprenticeDetailsControllerFactory = (): Controller => {
  const loadApprenticeInformationByAccountIdRepository = new ApprenticeMongoRepository()
  const loadApprenticeDetails = new DbLoadApprenticeDetails(loadApprenticeInformationByAccountIdRepository)
  const logErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(new GetApprenticeDetailsController(loadApprenticeDetails), logErrorRepository)
}
