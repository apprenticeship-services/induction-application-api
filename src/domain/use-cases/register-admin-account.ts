import { AccountModel } from '../models/account'

export type RegisterAccountParams = Omit<AccountModel, '_id'| 'password'>

export interface RegisterAccount{
    register(credentials: RegisterAccountParams) : Promise<AccountModel>
}
