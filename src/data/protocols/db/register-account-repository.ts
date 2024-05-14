import { AccountModel } from '@/domain/models/account'

export type RegisterAccountRepositoryParams = Omit<AccountModel, '_id'>

export interface RegisterAccountRepository{
    register(credentials: RegisterAccountRepositoryParams): Promise<AccountModel>
}
