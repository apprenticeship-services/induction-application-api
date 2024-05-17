import { AccountModel } from '../models/account'
import { ApprenticeModel } from '../models/apprentice-model'

export type RegisterApprenticeAccountParams = Pick<AccountModel, 'name' | 'email'> & Pick<ApprenticeModel, 'trade' | 'advisor'>

export interface RegisterApprenticeAccount{
    register(apprenticeInformation:RegisterApprenticeAccountParams): Promise<AccountModel>
}
