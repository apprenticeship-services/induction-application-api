import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'

let accountsCollection
describe('Login Route', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })
  describe('POST /login', () => {
    test('Should return 400 if invalid params {email or password}', async () => {
      await request(app)
        .post('/api/login')
        .send({})
        .expect(400)
    })
  })
})
