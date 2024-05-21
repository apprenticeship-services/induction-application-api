import { ApprenticeModel } from '@/domain/models/apprentice-model'

export interface LoadApprenticeInformationByAccountIdRepository{
    loadById(accountId: string):Promise<ApprenticeModel>
}
