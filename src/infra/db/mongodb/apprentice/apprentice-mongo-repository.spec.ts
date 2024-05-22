import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { ApprenticeMongoRepository } from './apprentice-mongo-repository'
import { ApprenticeModel } from '@/domain/models/apprentice-model'
import MockDate from 'mockdate'
import { UpdateApprenticeInductionRepositoryParams } from '@/data/protocols/db/update-apprentice-induction-repository'
import { UpdateApprenticeAssessmentRepositoryParams } from '@/data/protocols/db/update-apprentice-assessment-repository'

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

  beforeEach(() => MockDate.set(new Date()))

  afterEach(async () => {
    MockDate.reset()
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

    test('Should return apprentice document if exists', async () => {
      const accountId = new ObjectId().toString()

      await apprenticesCollection.insertOne({
        accountId: new ObjectId(accountId)
      })
      const sut = new ApprenticeMongoRepository()
      const apprenticeDocument = await sut.loadById(accountId)
      expect(apprenticeDocument).toBeTruthy()
      expect(apprenticeDocument.accountId).toBe(accountId)
    })
  })

  describe('METHOD: updateInduction()', () => {
    test('Should update apprentice induction and updatedAt', async () => {
      const newAccountId = new ObjectId().toString()
      await apprenticesCollection.insertOne({
        accountId: new ObjectId(newAccountId),
        advisor: 'any_advisor',
        trade: 'any_trade',
        induction: false,
        assessment: false,
        updatedAt: null
      })

      const updateParams:UpdateApprenticeInductionRepositoryParams = {
        accountId: newAccountId,
        updatedAt: new Date()
      }

      const sut = new ApprenticeMongoRepository()
      await sut.updateInduction(updateParams)

      const updatedDocument = await apprenticesCollection.findOne({ accountId: new ObjectId(newAccountId) })
      const updatedDocumentMapped = MongoHelper.mapObjectId<ApprenticeModel>(updatedDocument)
      expect(updatedDocumentMapped.accountId).toBe(newAccountId)
      expect(updatedDocumentMapped.induction).toBe(true)
      expect(updatedDocumentMapped.updatedAt).toBeTruthy()
      expect(updatedDocumentMapped.updatedAt).toEqual(updateParams.updatedAt)
    })
  })

  describe('METHOD: updateAssessment()', () => {
    test('Should update apprentice assessment and updatedAt', async () => {
      const newAccountId = new ObjectId().toString()
      await apprenticesCollection.insertOne({
        accountId: new ObjectId(newAccountId),
        advisor: 'any_advisor',
        trade: 'any_trade',
        induction: true,
        assessment: false,
        updatedAt: new Date()
      })

      const updateParams:UpdateApprenticeAssessmentRepositoryParams = {
        accountId: newAccountId,
        updatedAt: new Date()
      }

      const sut = new ApprenticeMongoRepository()
      await sut.updateAssessment(updateParams)

      const updatedDocument = await apprenticesCollection.findOne({ accountId: new ObjectId(newAccountId) })
      const updatedDocumentMapped = MongoHelper.mapObjectId<ApprenticeModel>(updatedDocument)
      expect(updatedDocumentMapped.accountId).toBe(newAccountId)
      expect(updatedDocumentMapped.assessment).toBe(true)
      expect(updatedDocumentMapped.updatedAt).toBeTruthy()
      expect(updatedDocumentMapped.updatedAt).toEqual(updateParams.updatedAt)
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
