import { RegisterAccountRepository, RegisterAccountRepositoryParams } from '@/data/protocols/db/register-account-repository'
import { AccountModel } from '@/domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-by-email-repository'
import { DeleteAccountByIdRepository } from '@/data/protocols/db/delete-account-by-id-repository'
import { ObjectId } from 'mongodb'
import { LoadAccountByIdRepository } from '@/data/protocols/db/load-account-by-id-repository'

export class AccountMongoRepository implements RegisterAccountRepository, LoadAccountByEmailRepository, DeleteAccountByIdRepository {
  async register (credentials: RegisterAccountRepositoryParams, configOps: object = {}): Promise<AccountModel> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const { insertedId } = await accountsCollection.insertOne(credentials, configOps)
    const account = { _id: insertedId.toString(), ...credentials }
    return account
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const account = await accountsCollection.findOne({ email })
    return MongoHelper.mapObjectId<AccountModel>(account)
  }

  async deleteById (accountId: string): Promise<boolean> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const deleteResult = await accountsCollection.deleteOne({ _id: new ObjectId(accountId) })
    return deleteResult.deletedCount === 1
  }
}
