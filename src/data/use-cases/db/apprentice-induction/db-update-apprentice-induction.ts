import { UpdateApprenticeInductionRepository } from '@/data/protocols/db/update-apprentice-induction-repository'
import { UpdateApprenticeInduction } from '@/domain/use-cases/update-apprentice-induction'

export class DbUpdateApprenticeInduction implements UpdateApprenticeInduction {
  constructor (private readonly updateApprenticeInductionRepository: UpdateApprenticeInductionRepository) {
    this.updateApprenticeInductionRepository = updateApprenticeInductionRepository
  }

  async updateInduction (accountId: string): Promise<void> {
    return await this.updateApprenticeInductionRepository.updateInduction({
      accountId,
      updatedAt: new Date()
    })
  }
}
