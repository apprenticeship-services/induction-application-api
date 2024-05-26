import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log-mongo-repository'

describe('Log Mongo Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
  })
  afterEach(async () => {
    await errorCollection.deleteMany({})
  })

  test('Should create a error log on success ', async () => {
    const sut = new LogMongoRepository()
    await sut.logError('any_stack_trace')
    const countDocs = await errorCollection.countDocuments()
    expect(countDocs).toBeGreaterThanOrEqual(1)
  })
})
