import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection, ObjectId } from 'mongodb'
import { EmailServiceAdapter } from '@/infra/email/nodemailer/email-service/email-service-adapter'
import { MongoDbTransactionManager } from '@/infra/db/mongodb/transaction/mongodb-transaction-manager'
import { DbDeleteApprenticeAccountById } from '@/data/use-cases/db/account/db-delete-apprentice-account-by-id'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { ApprenticeModel } from '@/domain/models/apprentice-model'

let accountsCollection: Collection
let apprenticesCollection: Collection

describe('Register Admin Route', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    apprenticesCollection = await MongoHelper.getCollection('apprentices')
  })
  afterEach(async () => {
    await accountsCollection.deleteMany({})
    await apprenticesCollection.deleteMany({})
  })
  describe('Register apprentice route', () => {
    describe('POST /apprentices', () => {
      jest.spyOn(EmailServiceAdapter.prototype, 'sendRegistrationMail').mockReturnValueOnce(Promise.resolve(null))
      test('Should register an apprentice account and return no content', async () => {
        await request(app)
          .post('/api/apprentices')
          .send({
            name: 'apprentice_name',
            email: 'apprentice_email@hotmail.com',
            trade: 'apprentice_trade',
            advisor: 'apprentice_advisor'
          })
          .expect(204)
      })

      test('Should return 403 if apprentice email is already registered', async () => {
        await accountsCollection.insertOne({
          name: 'apprentice_name',
          email: 'apprentice_email@hotmail.com'
        })

        await request(app)
          .post('/api/apprentices')
          .send({
            name: 'apprentice_name',
            email: 'apprentice_email@hotmail.com',
            trade: 'apprentice_trade',
            advisor: 'apprentice_advisor'
          })
          .expect(403)
      })

      test('Should return 400 if required field is not provided', async () => {
        await request(app)
          .post('/api/apprentices')
          .send({ })
          .expect(400)
      })

      test('Should return 500 transaction fails', async () => {
        jest.spyOn(MongoDbTransactionManager.prototype, 'executeTransaction').mockRejectedValueOnce(new Error())
        await request(app)
          .post('/api/apprentices')
          .send({
            name: 'apprentice_name',
            email: 'apprentice_email@hotmail.com',
            trade: 'apprentice_trade',
            advisor: 'apprentice_advisor'
          })
          .expect(500)
      })
    })

    describe('DELETE /apprentices/:id', () => {
      test('Should return 204 on success', async () => {
        const account = await accountsCollection.insertOne({
          name: 'apprentice_name',
          email: 'apprentice_email@hotmail.com',
          role: 'apprentice'
        })

        const accountId = account.insertedId.toString()

        await apprenticesCollection.insertOne({
          accountId: new ObjectId(accountId)
        })
        await request(app)
          .delete(`/api/apprentices/${accountId}`)
          .expect(204)
      })

      test('Should return 400 if id is invalid', async () => {
        const invalidId = 'invalid_id_format'
        await request(app)
          .delete(`/api/apprentices/${invalidId}`)
          .expect(400)
      })

      test('Should return 404 if id is linked to any account', async () => {
        const randomId = new ObjectId()

        await request(app)
          .delete(`/api/apprentices/${randomId}`)
          .expect(404)
      })

      test('Should return 404 if id is not linked to an apprentice role account', async () => {
        const account = await accountsCollection.insertOne({
          name: 'apprentice_name',
          email: 'apprentice_email@hotmail.com',
          role: 'admin'
        })

        const accountId = account.insertedId.toString()

        await request(app)
          .delete(`/api/apprentices/${accountId}`)
          .expect(404)
      })

      test('Should return 500 if deletion fails', async () => {
        const account = await accountsCollection.insertOne({
          name: 'apprentice_name',
          email: 'apprentice_email@hotmail.com',
          role: 'apprentice'
        })

        jest.spyOn(DbDeleteApprenticeAccountById.prototype, 'deleteById').mockReturnValueOnce(Promise.resolve(false))

        const accountId = account.insertedId.toString()

        await request(app)
          .delete(`/api/apprentices/${accountId}`)
          .expect(500)
      })
    })

    describe('PUT /apprentice/induction', () => {
      test('Should return 204 and update apprentice document on success', async () => {
        const account = await accountsCollection.insertOne({
          name: 'apprentice_name',
          email: 'apprentice@hotmail.com',
          role: 'apprentice',
          password: 'valid_password'
        })
        const accountId = account.insertedId.toString()
        await apprenticesCollection.insertOne({
          accountId: new ObjectId(accountId),
          induction: false,
          updatedAt: null
        })
        jest.spyOn(BcryptAdapter.prototype, 'compare').mockReturnValueOnce(Promise.resolve(true))
        const response = await request(app)
          .post('/api/login')
          .send({
            email: 'apprentice@hotmail.com',
            password: 'valid_password'
          })
          .expect(200)

        const cookies = response.headers['set-cookie']

        const agent = request.agent(app)
        await agent
          .put('/api/apprentice/induction')
          .set('Cookie', cookies)
          .expect(204)

        const apprenticeDocument = await apprenticesCollection.findOne<ApprenticeModel>({ accountId: new ObjectId(accountId) })
        expect(apprenticeDocument.induction).toBe(true)
        expect(apprenticeDocument.updatedAt).toBeTruthy()
      })
    })
  })
})
