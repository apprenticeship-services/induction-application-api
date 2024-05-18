import { ApprenticeInformationParams, RegisterApprenticeInformationRepository } from '@/data/protocols/db/register-apprentice-induction-information'
import { MongoHelper } from '../helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export class ApprenticeMongoRepository implements RegisterApprenticeInformationRepository {
  async register (apprenticeInformation: ApprenticeInformationParams, configOps?: object): Promise<void> {
    const collection = await MongoHelper.getCollection('apprentices')
    await collection.insertOne({
      ...apprenticeInformation,
      accountId: new ObjectId(apprenticeInformation.accountId)
    }, configOps)
  }
}
