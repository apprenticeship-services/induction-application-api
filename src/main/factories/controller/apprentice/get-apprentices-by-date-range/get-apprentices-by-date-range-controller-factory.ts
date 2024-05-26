import { DbLoadApprenticeByDateRange } from '@/data/use-cases/db/apprentice/load-apprentices-by-date-range/db-load-apprentices-by-date-range'
import { ApprenticeMongoRepository } from '@/infra/db/mongodb/apprentice/apprentice-mongo-repository'
import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository'
import { DateParamValidatorAdapter } from '@/infra/validator/date-param-validator-adapter/date-param-validator-adapter'
import { LogControllerDecorator } from '@/main/decorators/log/log-controller-decorator'
import { GetApprenticesByDateRangeController } from '@/presentation/controllers/apprentice/get-apprentices-by-date-range/get-apprentices-by-date-range-controller'
import { Controller } from '@/presentation/protocols'
import { Validator } from '@/presentation/protocols/validator'
import { DateParamValidator } from '@/validator/validators/date-param-validator'
import { RequiredFieldValidator } from '@/validator/validators/requires-field-validator'
import { ValidatorComposite } from '@/validator/validators/validation-composite'

export const getApprenticesByDateRangeControllerFactory = (): Controller => {
  const validations: Validator[] = []

  for (const field of ['startDate', 'endDate']) {
    validations.push(new RequiredFieldValidator(field))
    validations.push(new DateParamValidator(field, new DateParamValidatorAdapter()))
  }

  const validator = new ValidatorComposite(validations)
  const loadApprenticesByDateRangeRepository = new ApprenticeMongoRepository()
  const loadApprenticesByDateRange = new DbLoadApprenticeByDateRange(loadApprenticesByDateRangeRepository)
  return new LogControllerDecorator(new GetApprenticesByDateRangeController(validator, loadApprenticesByDateRange), new LogMongoRepository())
}
