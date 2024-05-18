import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { EmailServiceAdapter } from '@/infra/email/nodemailer/email-service/email-service-adapter'
import { forbidden } from '@/presentation/helpers/http-helper'
import { AlreadyExists } from '@/presentation/errors/already-exists'

let accountsCollection: Collection

describe('Register Admin Route', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
  })
  afterEach(async () => await accountsCollection.deleteMany({}))
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
    })
  })
})
