import { AccountModel } from '@/domain/models/account'
import { RegisterAccountParams } from '@/domain/use-cases/register-account'

export interface RegisterAccountRepository{
    register(credentials: RegisterAccountParams): Promise<AccountModel>
}
