import { ApprenticeModel } from '../models/apprentice-model'

export interface LoadApprenticeInformationByAccountId {
    loadById(accountId:string):Promise<ApprenticeModel>
}
