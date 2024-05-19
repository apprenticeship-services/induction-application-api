import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { EmailServiceAdapter } from '@/infra/email/nodemailer/email-service/email-service-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'

let accountsCollection: Collection

describe('Register Admin Route', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
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

    describe('DELETE /admins/:id', () => {
      test('Should delete an admin account and return no content', async () => {
        const { insertedId } = await accountsCollection.insertOne({
          name: 'any_name',
          email: 'any_email@hotmail.com',
          role: 'admin'
        })

        const idParam = insertedId.toString()
        await request(app)
          .delete(`/api/admins/${idParam}`)
          .expect(204)
      })

      test('Should return 400 if id is invalid', async () => {
        const idParam = 'invalid'
        await request(app)
          .delete(`/api/admins/${idParam}`)
          .expect(400)
      })

      test('Should return 404 if account is not registered as admin', async () => {
        const { insertedId } = await accountsCollection.insertOne({
          name: 'any_name',
          email: 'any_email@hotmail.com',
          role: 'other_role'
        })

        const idParam = insertedId.toString()
        await request(app)
          .delete(`/api/admins/${idParam}`)
          .expect(404)
      })

      test('Should return 500 if some method throws', async () => {
        const { insertedId } = await accountsCollection.insertOne({
          name: 'any_name',
          email: 'any_email@hotmail.com',
          role: 'admin'
        })

        jest.spyOn(AccountMongoRepository.prototype, 'deleteById').mockImplementationOnce(async () => {
          throw new Error()
        })

        const idParam = insertedId.toString()
        await request(app)
          .delete(`/api/admins/${idParam}`)
          .expect(500)
      })
    })
  })
})
