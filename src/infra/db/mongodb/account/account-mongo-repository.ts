import { RegisterAccountRepository, RegisterAccountRepositoryParams } from '@/data/protocols/db/register-account-repository'
import { AccountModel } from '@/domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-by-email-repository'

export class AccountMongoRepository implements RegisterAccountRepository, LoadAccountByEmailRepository {
  async register (credentials: RegisterAccountRepositoryParams): Promise<AccountModel> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const { insertedId } = await accountsCollection.insertOne(credentials)
    const account = { _id: insertedId.toString(), ...credentials }
    return account
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const account = await accountsCollection.findOne({ email })
    return MongoHelper.mapObjectId<AccountModel>(account)
  }
}
