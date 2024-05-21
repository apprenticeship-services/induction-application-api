import { LoadApprenticeInformationByAccountIdRepository } from '@/data/protocols/db/load-apprentice-information-by-account-id-repository'
import { ApprenticeModel } from '@/domain/models/apprentice-model'
import { LoadApprenticeInformationByAccountId } from '@/domain/use-cases/load-apprentice-information-by-account-id'

export class DbLoadApprenticeInformationByAccountId implements LoadApprenticeInformationByAccountId {
  constructor (private readonly loadApprenticeInformationByAccountIdRepo: LoadApprenticeInformationByAccountIdRepository) {
    this.loadApprenticeInformationByAccountIdRepo = loadApprenticeInformationByAccountIdRepo
  }

  async loadById (accountId: string): Promise<ApprenticeModel> {
    const apprenticeInfo = await this.loadApprenticeInformationByAccountIdRepo.loadById(accountId)
    return apprenticeInfo
  }
}
