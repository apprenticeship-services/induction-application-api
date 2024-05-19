import { AccountModel } from '../models/account'

export interface LoadAccountById {
    loadById(accountId:string): Promise<AccountModel>
}
