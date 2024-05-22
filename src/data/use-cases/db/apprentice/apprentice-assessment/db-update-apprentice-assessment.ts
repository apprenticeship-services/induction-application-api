import { UpdateApprenticeAssessmentRepository } from '@/data/protocols/db/update-apprentice-assessment-repository'
import { UpdateApprenticeAssessment } from '@/domain/use-cases/update-apprentice-assessment'

export class DbUpdateApprenticeAssessment implements UpdateApprenticeAssessment {
  constructor (private readonly updateApprenticeAssessmentRepository: UpdateApprenticeAssessmentRepository) {
    this.updateApprenticeAssessmentRepository = updateApprenticeAssessmentRepository
  }

  async updateAssessment (accountId: string): Promise<void> {
    return await this.updateApprenticeAssessmentRepository.updateAssessment({
      accountId,
      updatedAt: new Date()
    })
  }
}
