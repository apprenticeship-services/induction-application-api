import { LoadApprenticeInformationByAccountIdRepository } from '@/data/protocols/db/load-apprentice-information-by-account-id-repository'
import { ApprenticeDetailsModel } from '@/domain/models/apprentice-details'
import { LoadApprenticeDetails } from '@/domain/use-cases/load-apprentice-details'

export class DbLoadApprenticeDetails implements LoadApprenticeDetails {
  constructor (
    private readonly loadApprenticeInformationByAccountIdRepository: LoadApprenticeInformationByAccountIdRepository
  ) {
    this.loadApprenticeInformationByAccountIdRepository = loadApprenticeInformationByAccountIdRepository
  }

  async loadApprenticeDetails (accountId: string): Promise<ApprenticeDetailsModel> {
    const fullApprenticeDetails = await this.loadApprenticeInformationByAccountIdRepository.loadById(accountId)
    if (!fullApprenticeDetails) {
      return null
    }
    const apprenticeDetails: ApprenticeDetailsModel = {
      trade: fullApprenticeDetails.trade,
      advisor: fullApprenticeDetails.advisor,
      induction: fullApprenticeDetails.induction,
      assessment: fullApprenticeDetails.assessment
    }
    return apprenticeDetails
  }
}
