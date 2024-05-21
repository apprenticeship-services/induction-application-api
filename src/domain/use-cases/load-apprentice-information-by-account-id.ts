import { ApprenticeModel } from '../models/apprentice-model'

export interface LoadApprenticeInformationByAccountId {
    loadById(account:string):Promise<ApprenticeModel>
}
