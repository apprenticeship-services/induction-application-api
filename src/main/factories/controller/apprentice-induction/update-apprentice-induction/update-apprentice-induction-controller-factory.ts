import { DbLoadApprenticeInformationByAccountId } from '@/data/use-cases/db/apprentice-induction/db-load-apprentice-information-by-account-id'
import { DbUpdateApprenticeInduction } from '@/data/use-cases/db/apprentice-induction/db-update-apprentice-induction'
import { ApprenticeMongoRepository } from '@/infra/db/mongodb/apprentice/apprentice-mongo-repository'
import { UpdateApprenticeInductionController } from '@/presentation/controllers/apprentice-induction/induction/update-apprentice-induction-controller'
import { Controller } from '@/presentation/protocols'

export const updateApprenticeInductionControllerFactory = (): Controller => {
  const loadApprenticeInformationByAccountIdRepository = new ApprenticeMongoRepository()
  const loadApprenticeInformationByAccountId = new DbLoadApprenticeInformationByAccountId(loadApprenticeInformationByAccountIdRepository)
  const updateApprenticeInductionRepository = new ApprenticeMongoRepository()
  const updateApprenticeInduction = new DbUpdateApprenticeInduction(updateApprenticeInductionRepository)
  return new UpdateApprenticeInductionController(loadApprenticeInformationByAccountId, updateApprenticeInduction)
}
