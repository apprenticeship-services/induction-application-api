import { AccountModel } from '../models/account'

export interface LoadAccountByToken {
    loadByToken(token:string, rolePermission: string):Promise<AccountModel>
}
