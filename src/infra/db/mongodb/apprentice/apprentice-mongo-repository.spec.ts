import { Collection, ObjectId, WithId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { ApprenticeMongoRepository } from './apprentice-mongo-repository'
import { ApprenticeModel } from '@/domain/models/apprentice-model'

let apprenticesCollection:Collection
describe('ApprenticeMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    apprenticesCollection = await MongoHelper.getCollection('apprentices')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  afterEach(async () => {
    await apprenticesCollection.deleteMany({})
  })

  test('Should register new Apprentice Document on success', async () => {
    const { insertedId } = await (await MongoHelper.getCollection('accounts')).insertOne({
      email: 'any_email@hotmail.com'
    })
    const sut = new ApprenticeMongoRepository()
    await sut.register({
      accountId: insertedId.toString(),
      advisor: 'any_advisor',
      trade: 'any_trade',
      induction: false,
      assessment: false,
      updatedAt: null
    })

    const document = await apprenticesCollection.find<ApprenticeModel>({ accountId: new ObjectId(insertedId.toString()) }).next()
    expect(document).toBeDefined()
    expect(document.accountId.toString()).toBe(insertedId.toString())
  })
})
