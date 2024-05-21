import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { ApprenticeMongoRepository } from './apprentice-mongo-repository'
import { ApprenticeModel } from '@/domain/models/apprentice-model'

let apprenticesCollection: Collection
let accountsCollection: Collection
describe('ApprenticeMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    accountsCollection = await MongoHelper.getCollection('accounts')
    apprenticesCollection = await MongoHelper.getCollection('apprentices')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  afterEach(async () => {
    await accountsCollection.deleteMany({})
    await apprenticesCollection.deleteMany({})
  })

  describe('METHOD: register()', () => {
    test('Should register new Apprentice Document on success', async () => {
      const { insertedId } = await accountsCollection.insertOne({
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

      const document = await apprenticesCollection.findOne<ApprenticeModel>({ accountId: new ObjectId(insertedId.toString()) })
      expect(document).toBeDefined()
      expect(document.accountId.toString()).toBe(insertedId.toString())
    })
  })

  describe('METHOD: loadById()', () => {
    test('Should return null if apprentice information does not exist', async () => {
      const sut = new ApprenticeMongoRepository()
      const apprenticeDocument = await sut.loadById(new ObjectId().toString())
      expect(apprenticeDocument).toBeNull()
    })
  })

  describe('METHOD: deleteById()', () => {
    test('Should delete apprentice document on success', async () => {
      const account = await accountsCollection.insertOne({
        email: 'any_email@hotmail.com',
        role: 'apprentice'
      })

      await apprenticesCollection.insertOne({
        accountId: new ObjectId(account.insertedId.toString())
      })
      const sut = new ApprenticeMongoRepository()
      await sut.deleteById(account.insertedId.toString())

      const apprenticeDocument = await apprenticesCollection.findOne<ApprenticeModel>({ accountId: new ObjectId(account.insertedId.toString()) })
      expect(apprenticeDocument).toBeFalsy()
    })

    test('Should not delete document if document is not linked to any account', async () => {
      const account = await accountsCollection.insertOne({
        email: 'any_email@hotmail.com',
        role: 'apprentice'
      })

      await apprenticesCollection.insertOne({
        accountId: new ObjectId(account.insertedId.toString())
      })

      const differentId = new ObjectId().toString()

      const sut = new ApprenticeMongoRepository()
      const deleteResult = await sut.deleteById(differentId)
      expect(deleteResult).toBe(false)

      const apprenticeDocument = await apprenticesCollection.findOne<ApprenticeModel>({ accountId: new ObjectId(account.insertedId.toString()) })
      expect(apprenticeDocument).toBeTruthy()
    })
  })
})
