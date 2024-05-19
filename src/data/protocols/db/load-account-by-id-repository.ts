import { AccountModel } from '@/domain/models/account'

export interface LoadAccountByIdRepository{
    loadById(accountId):Promise<AccountModel>
}
