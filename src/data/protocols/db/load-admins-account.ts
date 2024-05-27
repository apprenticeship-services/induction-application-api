import { AdminAccount } from '@/domain/use-cases/load-admins-account'

export interface LoadAdminsRepository{
    loadAdmins():Promise<AdminAccount[]>
}
