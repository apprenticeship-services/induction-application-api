import { ApprenticeInformationParams, RegisterApprenticeInformationRepository } from '@/data/protocols/db/register-apprentice-induction-information'
import { MongoHelper } from '../helpers/mongo-helper'
import { ObjectId } from 'mongodb'
import { DeleteApprenticeInformationByAccountIdRepository } from '@/data/protocols/db/delete-apprentice-information-by-account-id-repository'

export class ApprenticeMongoRepository implements RegisterApprenticeInformationRepository, DeleteApprenticeInformationByAccountIdRepository {
  async register (apprenticeInformation: ApprenticeInformationParams, configOps?: object): Promise<void> {
    const collection = await MongoHelper.getCollection('apprentices')
    await collection.insertOne({
      ...apprenticeInformation,
      accountId: new ObjectId(apprenticeInformation.accountId)
    }, configOps)
  }

  async deleteById (accountId: string, transactionOps?: object): Promise<boolean> {
    const apprenticesCollection = await MongoHelper.getCollection('apprentices')
    const deleteResult = await apprenticesCollection.deleteOne({ accountId: new ObjectId(accountId) }, transactionOps)
    return deleteResult.deletedCount === 1
  }
}
