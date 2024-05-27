import { MongoHelper } from '../helpers/mongo-helper'
import { AdminAccount, LoadAdminsAccount } from '@/domain/use-cases/load-admins-account'

export class AdminsMongoRepository implements
  LoadAdminsAccount {
  async loadAdmins (): Promise<AdminAccount[]> {
    const collection = await MongoHelper.getCollection('accounts')
    const admins = await collection.find<AdminAccount>({ role: 'admin' }).project(
      {
        _id: 0,
        password: 0
      }
    ).toArray() as AdminAccount[]
    return admins
  }
}
