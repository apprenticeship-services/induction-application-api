import { AccountModel } from '@/domain/models/account'

export interface LoadAccountByIdRepository{
    loadById(accountId:string):Promise<AccountModel>
}
