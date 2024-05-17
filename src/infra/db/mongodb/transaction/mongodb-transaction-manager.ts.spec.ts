import { MongoDbTransactionManager } from './mongodb-transaction-manager'
import { MongoHelper } from '../helpers/mongo-helper'
import { ClientSession } from 'mongodb'

const transactionMock = jest.fn()

describe('MongoDbTransactionManager', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(() => jest.clearAllMocks())

  test('should start, commit, and end the transaction session on success', async () => {
    const sut = new MongoDbTransactionManager()
    const startTransactionSpy = jest.spyOn(ClientSession.prototype, 'startTransaction')
    const commitTransactionSpy = jest.spyOn(ClientSession.prototype, 'commitTransaction')
    const endSessionSpy = jest.spyOn(ClientSession.prototype, 'endSession')
    const result = await sut.executeTransaction(() => Promise.resolve(true))
    expect(result).toBe(true)
    expect(startTransactionSpy).toHaveBeenCalled()
    expect(commitTransactionSpy).toHaveBeenCalled()
    expect(endSessionSpy).toHaveBeenCalled()
  })

  test('should abort transaction on fail and not commit ', async () => {
    const sut = new MongoDbTransactionManager()
    const startTransactionSpy = jest.spyOn(ClientSession.prototype, 'startTransaction')
    const commitTransactionSpy = jest.spyOn(ClientSession.prototype, 'commitTransaction')
    const abortTransactionSpy = jest.spyOn(ClientSession.prototype, 'abortTransaction')
    const endSessionSpy = jest.spyOn(ClientSession.prototype, 'endSession')
    const mockTransaction = jest.fn().mockRejectedValue(new Error('mockError'))
    await expect(sut.executeTransaction(mockTransaction)).rejects.toThrow('mockError')
    expect(startTransactionSpy).toHaveBeenCalled()
    expect(commitTransactionSpy).toHaveBeenCalledTimes(0)
    expect(abortTransactionSpy).toHaveBeenCalled()
    expect(endSessionSpy).toHaveBeenCalled()
  })
})
