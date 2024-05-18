import { AccountModel } from '@/domain/models/account'

export type RegisterAccountRepositoryParams = Omit<AccountModel, '_id'>

export interface RegisterAccountRepository{
    register(credentials: RegisterAccountRepositoryParams, configOps?:object): Promise<AccountModel>
}
