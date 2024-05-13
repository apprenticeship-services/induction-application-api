import { AccountModel } from '../models/account'

export type RegisterAdminAccountParams = Omit<AccountModel, '_id'| 'password'>

export interface RegisterAdminAccount{
    register(credentials: RegisterAdminAccountParams) : Promise<AccountModel>
}
