import { LoadApprenticeInformationByAccountId } from '@/domain/use-cases/load-apprentice-information-by-account-id'
import { UpdateApprenticeAssessment } from '@/domain/use-cases/update-apprentice-assessment'
import { ApprenticeNotFoundError } from '@/presentation/errors/apprentice-not-found-error'
import { InvalidAssessmentRequestError } from '@/presentation/errors/invalid-assessment-request-error'
import { badRequest, forbidden, noContent, notFound, serverError } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { Validator } from '@/presentation/protocols/validator'

export class UpdateApprenticeAssessmentController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly loadApprenticeInformationByAccountId: LoadApprenticeInformationByAccountId,
    private readonly updateApprenticeAssessment: UpdateApprenticeAssessment) {
    this.updateApprenticeAssessment = updateApprenticeAssessment
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const accountId = request.accountId
      const apprenticeInformation = await this.loadApprenticeInformationByAccountId.loadById(accountId)
      if (!apprenticeInformation) {
        return notFound(new ApprenticeNotFoundError())
      }

      if (!apprenticeInformation.induction) {
        return forbidden(new InvalidAssessmentRequestError())
      }

      if (apprenticeInformation.assessment) {
        return noContent()
      }

      const error = this.validator.validate(request.body)

      if (error) {
        return badRequest(error)
      }

      await this.updateApprenticeAssessment.updateAssessment(accountId)
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
