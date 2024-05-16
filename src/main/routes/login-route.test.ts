import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'
import { Collection, ObjectId } from 'mongodb'
import { AccountModel } from '@/domain/models/account'

let accountsCollection: Collection
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

    test('Should return 401 if email is not registered', async () => {
      await accountsCollection.insertOne({
        name: 'test_name',
        email: 'test_email@hotmail.com',
        role: 'test_role',
        password: 'test_password',
        createdAt: new Date()
      })

      await request(app)
        .post('/api/login')
        .send({
          email: 'email_not_registered@hotmail.com',
          password: 'any_password'
        })
        .expect(401)
    })
  })
})
