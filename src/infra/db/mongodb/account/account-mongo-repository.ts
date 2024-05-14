import { RegisterAccountRepository, RegisterAccountRepositoryParams } from '@/data/protocols/db/register-account-repository'
import { AccountModel } from '@/domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements RegisterAccountRepository {
  async register (credentials: RegisterAccountRepositoryParams): Promise<AccountModel> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const { insertedId } = await accountsCollection.insertOne(credentials)
    const account = { _id: insertedId.toString(), ...credentials }
    return account
  }
}
