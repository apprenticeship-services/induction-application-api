import { ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AdminAccount, LoadAdminsAccount } from '@/domain/use-cases/load-admins-account'

export class AdminsMongoRepository implements
  LoadAdminsAccount {
  async loadAdmins (): Promise<AdminAccount[]> {
    const collection = await MongoHelper.getCollection('accounts')
    const admins = await collection.aggregate<AdminAccount>([
      { $match: { role: 'admin' } },
      {
        $addFields: { accountId: { $toString: '$_id' } }
      },
      {
        $project: { _id: 0, password: 0 }
      }
    ]).toArray() as AdminAccount[]
    return admins
  }
}
