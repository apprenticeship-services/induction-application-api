import { ObjectId } from 'mongodb'
import { MongoHelper as sut } from './mongo-helper'

describe('', () => {
  beforeAll(async () => await sut.connect(process.env.MONGO_URL))

  afterAll(async () => await sut.disconnect())

  test('Should reconnect if mongodb is down', async () => {
    await sut.disconnect()
    const randomCollection = await sut.getCollection('example')
    expect(randomCollection).toBeTruthy()
  })

  describe('mapObjectId', () => {
    test('should convert any new ObjectId to string', async () => {
      const randomCollection = await sut.getCollection('example')
      await randomCollection.insertOne({
        _id: new ObjectId(),
        otherId: new ObjectId(),
        stringId: 'string_id'
      })

      type TestIdDoc = {
        _id: string,
        otherId: string,
        stringId: string
      }
      const document = await randomCollection.findOne({ stringId: 'string_id' })
      const mappedObj = sut.mapObjectId<TestIdDoc>(document)
      expect(typeof mappedObj._id).toBe('string')
      expect(typeof mappedObj.otherId).toBe('string')
      expect(typeof mappedObj.stringId).toBe('string')
    })
  })
})
