import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { EmailServiceAdapter } from '@/infra/email/nodemailer/email-service/email-service-adapter'

let accountsCollection: Collection

describe('Register Admin Route', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })
  afterEach(async () => await accountsCollection.deleteMany({}))
  describe('Register admin route', () => {
    describe('POST /admins', () => {
      jest.spyOn(EmailServiceAdapter.prototype, 'sendRegistrationMail').mockReturnValueOnce(Promise.resolve(null))
      test('Should register an admin account and return no content', async () => {
        await request(app)
          .post('/api/admins')
          .send({
            name: 'admin_name',
            email: 'admin_email@hotmail.com'
          })
          .expect(204)
      })

      test('Should return BadRequest if name is not provided during registration', async () => {
        await request(app)
          .post('/api/admins')
          .send({
            email: 'admin_email@hotmail.com'
          })
          .expect(400)
      })

      test('Should return BadRequest if email is not provided during registration', async () => {
        await request(app)
          .post('/api/admins')
          .send({
          })
          .expect(400)
      })

      test('Should return Forbidden Error if email is already in use', async () => {
        await accountsCollection.insertOne({
          name: 'any_name',
          email: 'registered_email@hotmail.com'
        })
        await request(app)
          .post('/api/admins')
          .send({
            name: 'any_name',
            email: 'registered_email@hotmail.com'
          })
          .expect(403)
      })
    })
  })
})
