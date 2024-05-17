import { TransactionManager } from '@/data/protocols/transaction/transaction-manager'
import { MongoHelper } from '../helpers/mongo-helper'
import { ClientSession } from 'mongodb'

export class MongoDbTransactionManager implements TransactionManager {
  private session: ClientSession = null
  async executeTransaction<T> (transaction: () => Promise<T>): Promise<T> {
    this.session = await MongoHelper.createTransactionSession()
    try {
      this.session.startTransaction()
      const result = await transaction()
      await this.session.commitTransaction()
      return result
    } catch (e) {
      if (this.session) {
        await this.session.abortTransaction()
      }
      throw e
    } finally {
      this.session.endSession()
    }
  }
}
