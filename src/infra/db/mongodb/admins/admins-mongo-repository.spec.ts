import { AdminsMongoRepository } from './admins-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'

let collection: Collection

describe('AdminsMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    collection = await MongoHelper.getCollection('accounts')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  afterEach(async () => {
    await collection.deleteMany({})
  })

  test('should return a list of admins on success', async () => {
    const admin1 = { name: 'Admin 1', email: 'admin1@example.com', role: 'admin', createdAt: '2024-01-01' }
    const admin2 = { name: 'Admin 2', email: 'admin2@example.com', role: 'admin', createdAt: '2024-01-02' }
    await collection.insertOne(admin1)
    await collection.insertOne(admin2)
    const sut = new AdminsMongoRepository()
    const result = await sut.loadAdmins()
    expect(result.length).toBe(2)
  })
})
