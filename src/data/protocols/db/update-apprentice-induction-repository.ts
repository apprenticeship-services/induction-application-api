export type UpdateApprenticeInductionRepositoryParams = {
    accountId: string
    updatedAt: Date
}

export interface UpdateApprenticeInductionRepository{
    updateInduction(data:UpdateApprenticeInductionRepositoryParams):Promise<void>
}
