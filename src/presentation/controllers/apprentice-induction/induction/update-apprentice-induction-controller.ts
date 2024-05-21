import { LoadApprenticeInformationByAccountId } from '@/domain/use-cases/load-apprentice-information-by-account-id'
import { UpdateApprenticeInduction } from '@/domain/use-cases/update-apprentice-induction'
import { ApprenticeNotFoundError } from '@/presentation/errors/apprentice-not-found-error'
import { noContent, notFound, serverError } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class UpdateApprenticeInductionController implements Controller {
  constructor (private readonly loadApprenticeInformationByAccountId: LoadApprenticeInformationByAccountId,
    private readonly updateApprenticeInduction: UpdateApprenticeInduction) {
    this.updateApprenticeInduction = updateApprenticeInduction
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const accountId = request.accountId
      const apprenticeInformation = await this.loadApprenticeInformationByAccountId.loadById(accountId)
      if (!apprenticeInformation) {
        return notFound(new ApprenticeNotFoundError())
      }

      if (apprenticeInformation.induction) {
        return noContent()
      }

      await this.updateApprenticeInduction.updateInduction(accountId)
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
