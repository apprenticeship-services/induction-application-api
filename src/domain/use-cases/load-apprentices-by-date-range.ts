import { AccountModel } from '../models/account'
import { ApprenticeModel } from '../models/apprentice-model'

export type ApprenticeInformationModel = Omit<AccountModel, '_id' | 'password'> & Omit<ApprenticeModel, '_id'>

export interface LoadApprenticesByDateRange{
    loadByDateRange(startDate: Date, endDate: Date):Promise<ApprenticeInformationModel[]>
}
