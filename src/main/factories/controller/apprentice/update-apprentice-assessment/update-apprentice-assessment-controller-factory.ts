import { DbUpdateApprenticeAssessment } from '@/data/use-cases/db/apprentice/apprentice-assessment/db-update-apprentice-assessment'
import { DbLoadApprenticeInformationByAccountId } from '@/data/use-cases/db/apprentice/load-apprentice-information-by-account-id/db-load-apprentice-information-by-account-id'
import { ApprenticeMongoRepository } from '@/infra/db/mongodb/apprentice/apprentice-mongo-repository'
import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository'
import { LogControllerDecorator } from '@/main/decorators/log/log-controller-decorator'
import { UpdateApprenticeAssessmentController } from '@/presentation/controllers/apprentice/apprentice-assessment/update-apprentice-assessment-controller'
import { Controller } from '@/presentation/protocols'
import { assessmentSchema } from '@/presentation/schemas/assessment-answers-schema'
import { AssessmentValidator } from '@/validator/validators/assessment-validator'

export const updateApprenticeAssessmentControllerFactory = (): Controller => {
  const assessmentValidator = new AssessmentValidator(assessmentSchema)
  const loadApprenticeInformationByAccountIdRepository = new ApprenticeMongoRepository()
  const loadApprenticeInformationByAccountId = new DbLoadApprenticeInformationByAccountId(loadApprenticeInformationByAccountIdRepository)
  const updateApprenticeAssessmentRepository = new ApprenticeMongoRepository()
  const updateApprenticeAssessment = new DbUpdateApprenticeAssessment(updateApprenticeAssessmentRepository)
  return new LogControllerDecorator(new UpdateApprenticeAssessmentController(assessmentValidator, loadApprenticeInformationByAccountId, updateApprenticeAssessment), new LogMongoRepository())
}
