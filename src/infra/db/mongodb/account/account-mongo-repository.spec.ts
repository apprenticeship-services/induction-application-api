import { Collection } from 'mongodb'
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
  })
  afterAll(async () => {
    MockDate.reset()
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
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
      console.log(account)
      expect(account).toBeTruthy()
    })
  })
})
