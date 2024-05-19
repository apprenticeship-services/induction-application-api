import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'
import { RegisterAccountRepositoryParams } from '@/data/protocols/db/register-account-repository'
import MockDate from 'mockdate'

const fakeAccountData = (): RegisterAccountRepositoryParams => ({
  name: 'any_name',
  email: 'any_email@hotmail.com',
  role: 'any_role',
  password: 'hashed_password',
  createdAt: new Date()
})

let accountsCollection: Collection
describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    await MongoHelper.connect(process.env.MONGO_URL)
    accountsCollection = await MongoHelper.getCollection('accounts')
  })
  afterAll(async () => {
    MockDate.reset()
    await MongoHelper.disconnect()
  })

  afterEach(async () => {
    await accountsCollection.deleteMany({})
  })
  describe('Method: register()', () => {
    test('Should register account on success', async () => {
      const sut = new AccountMongoRepository()
      const accountData = fakeAccountData()
      const account = await sut.register(accountData)
      expect(account).toBeTruthy()
      expect(account._id).toBeTruthy()
      expect(account.name).toBe(fakeAccountData().name)
      expect(account.email).toBe(fakeAccountData().email)
      expect(account.role).toBe(fakeAccountData().role)
      expect(account.password).toBe(fakeAccountData().password)
      expect(account.createdAt).toEqual(fakeAccountData().createdAt)
    })
  })

  describe('Method: loadByEmail()', () => {
    test('Should return null if email is not registered', async () => {
      const sut = new AccountMongoRepository()
      const account = await sut.loadByEmail('fake_email@hotmail.com')
      expect(account).toBeNull()
    })

    test('Should return account if email is found', async () => {
      const sut = new AccountMongoRepository()
      await accountsCollection.insertOne(fakeAccountData())
      const account = await sut.loadByEmail(fakeAccountData().email)
      expect(account).toBeTruthy()
    })
  })

  describe('Method: deleteById()', () => {
    test('Should return false if _id does not exists', async () => {
      const fakeId = new ObjectId()
      const sut = new AccountMongoRepository()
      const deleteResult = await sut.deleteById(fakeId.toString())
      expect(deleteResult).toBe(false)
    })

    test('Should return true if _id exists', async () => {
      const { insertedId } = await accountsCollection.insertOne(fakeAccountData())
      const sut = new AccountMongoRepository()
      const deleteResult = await sut.deleteById(insertedId.toString())
      expect(deleteResult).toBe(true)
    })
  })
})
