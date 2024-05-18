import { TransactionManager } from '@/data/protocols/transaction/transaction-manager'
import { MongoHelper } from '../helpers/mongo-helper'
import { ClientSession } from 'mongodb'

export class MongoDbTransactionManager implements TransactionManager {
  async executeTransaction<T> (transaction: (session?: ClientSession) => Promise<T>): Promise<T> {
    const session = MongoHelper.client.startSession()
    try {
      const result = await session.withTransaction(async () => await transaction(session), {
        readPreference: 'primary',
        retryWrites: true,
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
      })
      return result
    } finally {
      await session.endSession()
    }
  }
}
