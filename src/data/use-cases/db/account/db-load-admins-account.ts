import { LoadAdminsRepository } from '@/data/protocols/db/load-admins-account'
import { AdminAccount, LoadAdminsAccount } from '@/domain/use-cases/load-admins-account'

export class DbLoadAdminsAccount implements LoadAdminsAccount {
  constructor (private readonly loadAdminsRepository: LoadAdminsRepository) {
    this.loadAdminsRepository = loadAdminsRepository
  }

  async loadAdmins (): Promise<AdminAccount[]> {
    const admins = await this.loadAdminsRepository.loadAdmins()
    return admins
  }
}
