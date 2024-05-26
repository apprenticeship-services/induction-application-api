import { DbLoadApprenticeInformationByAccountId } from '@/data/use-cases/db/apprentice/load-apprentice-information-by-account-id/db-load-apprentice-information-by-account-id'
import { DbUpdateApprenticeInduction } from '@/data/use-cases/db/apprentice/apprentice-induction/db-update-apprentice-induction'
import { ApprenticeMongoRepository } from '@/infra/db/mongodb/apprentice/apprentice-mongo-repository'
import { UpdateApprenticeInductionController } from '@/presentation/controllers/apprentice/apprentice-induction/update-apprentice-induction-controller'
import { Controller } from '@/presentation/protocols'
import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository'
import { LogControllerDecorator } from '@/main/decorators/log/log-controller-decorator'

export const updateApprenticeInductionControllerFactory = (): Controller => {
  const loadApprenticeInformationByAccountIdRepository = new ApprenticeMongoRepository()
  const loadApprenticeInformationByAccountId = new DbLoadApprenticeInformationByAccountId(loadApprenticeInformationByAccountIdRepository)
  const updateApprenticeInductionRepository = new ApprenticeMongoRepository()
  const updateApprenticeInduction = new DbUpdateApprenticeInduction(updateApprenticeInductionRepository)
  return new LogControllerDecorator(
    new UpdateApprenticeInductionController(loadApprenticeInformationByAccountId, updateApprenticeInduction),
    new LogMongoRepository())
}
