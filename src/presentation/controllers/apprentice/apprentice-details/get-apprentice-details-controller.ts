import { LoadApprenticeDetails } from '@/domain/use-cases/load-apprentice-details'
import { ApprenticeNotFoundError } from '@/presentation/errors/apprentice-not-found-error'
import { notFound, serverError, success } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class GetApprenticeDetailsController implements Controller {
  constructor (
        private readonly loadApprenticeDetails: LoadApprenticeDetails
  ) {
    this.loadApprenticeDetails = loadApprenticeDetails
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const apprenticeDetails = await this.loadApprenticeDetails.loadApprenticeDetails(request.accountId)
      if (!apprenticeDetails) {
        return notFound(new ApprenticeNotFoundError())
      }
      return success(apprenticeDetails)
    } catch (error) {
      return serverError(error)
    }
  }
}
