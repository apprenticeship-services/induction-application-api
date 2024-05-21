import { ApprenticeInformationParams, RegisterApprenticeInformationRepository } from '@/data/protocols/db/register-apprentice-induction-information'
import { MongoHelper } from '../helpers/mongo-helper'
import { ObjectId } from 'mongodb'
import { DeleteApprenticeInformationByAccountIdRepository } from '@/data/protocols/db/delete-apprentice-information-by-account-id-repository'
import { LoadApprenticeInformationByAccountIdRepository } from '@/data/protocols/db/load-apprentice-information-by-account-id-repository'
import { ApprenticeModel } from '@/domain/models/apprentice-model'
import { UpdateApprenticeInductionRepository, UpdateApprenticeInductionRepositoryParams } from '@/data/protocols/db/update-apprentice-induction-repository'

export class ApprenticeMongoRepository implements
  RegisterApprenticeInformationRepository,
  LoadApprenticeInformationByAccountIdRepository,
  DeleteApprenticeInformationByAccountIdRepository,
  UpdateApprenticeInductionRepository {
  async register (apprenticeInformation: ApprenticeInformationParams, configOps?: object): Promise<void> {
    const collection = await MongoHelper.getCollection('apprentices')
    await collection.insertOne({
      ...apprenticeInformation,
      accountId: new ObjectId(apprenticeInformation.accountId)
    }, configOps)
  }

  async loadById (accountId: string): Promise<ApprenticeModel> {
    const apprenticesCollection = await MongoHelper.getCollection('apprentices')
    const apprenticeInfo = await apprenticesCollection.findOne({ accountId: new ObjectId(accountId) })
    return MongoHelper.mapObjectId<ApprenticeModel>(apprenticeInfo)
  }

  async deleteById (accountId: string, transactionOps?: object): Promise<boolean> {
    const apprenticesCollection = await MongoHelper.getCollection('apprentices')
    const deleteResult = await apprenticesCollection.deleteOne({ accountId: new ObjectId(accountId) }, transactionOps)
    return deleteResult.deletedCount === 1
  }

  async updateInduction (data: UpdateApprenticeInductionRepositoryParams): Promise<void> {
    const apprenticesCollection = await MongoHelper.getCollection('apprentices')
    await apprenticesCollection.findOneAndUpdate({ accountId: new ObjectId(data.accountId) }, {
      $set: {
        induction: true,
        updatedAt: data.updatedAt
      }
    })
  }
}
