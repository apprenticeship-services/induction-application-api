import { MongoDbTransactionManager } from './mongodb-transaction-manager'
import { MongoHelper } from '../helpers/mongo-helper'
import { ClientSession, Collection } from 'mongodb'

let accountsCollection: Collection
let apprenticesCollection: Collection
describe('MongoDbTransactionManager', () => {
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

  test('should create account on transaction', async () => {
    const sut = new MongoDbTransactionManager()

    const mockTransaction = async (session) => {
      await accountsCollection.insertOne({
        name: 'any_name',
        email: 'any_email@hotmail.com',
        role: 'any_role',
        password: 'any_password',
        createdAt: new Date()
      }, { session })

      return 'account created'
    }
    const transactionResult = await sut.executeTransaction(mockTransaction)

    const account = await accountsCollection.findOne({ email: 'any_email@hotmail.com' })
    expect(account).toBeTruthy()
    expect(transactionResult).toBe('account created')
  })

  test('should not commit transactions on fail', async () => {
    const mockTransaction = async (session) => {
      await accountsCollection.insertOne({
        name: 'any_name',
        email: 'any_email@hotmail.com',
        role: 'any_role',
        password: 'any_password',
        createdAt: new Date()
      }, { session })

      await apprenticesCollection.insertOne({
        accountId: '123',
        name: 'any_name',
        email: 'any_email@hotmail.com',
        induction: false,
        assessment: false
      }, { session })

      await Promise.reject(new Error())
    }
    const sut = new MongoDbTransactionManager()
    const transactionResult = sut.executeTransaction(mockTransaction)

    const account = await accountsCollection.findOne({ email: 'any_email@hotmail.com' })
    const apprenticeInformation = await apprenticesCollection.findOne({ email: 'any_email@hotmail.com' })
    expect(account).toBeNull()
    expect(apprenticeInformation).toBeNull()
    expect(transactionResult).rejects.toThrow()
  })

  test('should abort transaction on fail and not commit ', async () => {
    const sut = new MongoDbTransactionManager()
    const withTransaction = jest.spyOn(ClientSession.prototype, 'withTransaction')
    const commitTransactionSpy = jest.spyOn(ClientSession.prototype, 'commitTransaction')
    const abortTransactionSpy = jest.spyOn(ClientSession.prototype, 'abortTransaction')
    const endSessionSpy = jest.spyOn(ClientSession.prototype, 'endSession')
    await expect(sut.executeTransaction(() => Promise.reject(new Error()))).rejects.toThrow()
    expect(withTransaction).toHaveBeenCalled()
    expect(commitTransactionSpy).toHaveBeenCalledTimes(0)
    expect(abortTransactionSpy).toHaveBeenCalled()
    expect(endSessionSpy).toHaveBeenCalled()
  })

  test('should start, commit, and end the transaction session on success', async () => {
    const sut = new MongoDbTransactionManager()
    const withTransactionSpy = jest.spyOn(ClientSession.prototype, 'withTransaction')
    const commitTransactionSpy = jest.spyOn(ClientSession.prototype, 'commitTransaction')
    const endSessionSpy = jest.spyOn(ClientSession.prototype, 'endSession')
    const result = await sut.executeTransaction(() => Promise.resolve(true))
    expect(result).toBe(true)
    expect(withTransactionSpy).toHaveBeenCalled()
    expect(commitTransactionSpy).toHaveBeenCalledTimes(1)
    expect(endSessionSpy).toHaveBeenCalled()
  })
})
