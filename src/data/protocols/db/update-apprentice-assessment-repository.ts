export type UpdateApprenticeAssessmentRepositoryParams = {
    accountId: string
    updatedAt: Date
}

export interface UpdateApprenticeAssessmentRepository{
    updateAssessment(data:UpdateApprenticeAssessmentRepositoryParams):Promise<void>
}
