import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection, ObjectId } from 'mongodb'
import { EmailServiceAdapter } from '@/infra/email/nodemailer/email-service/email-service-adapter'
import { MongoDbTransactionManager } from '@/infra/db/mongodb/transaction/mongodb-transaction-manager'
import { DbDeleteApprenticeAccountById } from '@/data/use-cases/db/account/db-delete-apprentice-account-by-id'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { ApprenticeModel } from '@/domain/models/apprentice-model'
import { DbUpdateApprenticeInduction } from '@/data/use-cases/db/apprentice/apprentice-induction/db-update-apprentice-induction'
import { DbUpdateApprenticeAssessment } from '@/data/use-cases/db/apprentice/apprentice-assessment/db-update-apprentice-assessment'
import { DbLoadApprenticeDetails } from '@/data/use-cases/db/apprentice/apprentice-details/db-load-apprentice-details'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'

let accountsCollection: Collection
let apprenticesCollection: Collection

describe('Apprentices Route', () => {
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

  describe('POST /apprentices', () => {
    jest.spyOn(EmailServiceAdapter.prototype, 'sendRegistrationMail').mockReturnValueOnce(Promise.resolve(null))
    test('Should register an apprentice account and return no content', async () => {
      await accountsCollection.insertOne({
        email: 'admin@hotmail.com',
        role: 'admin'
      })
      jest.spyOn(BcryptAdapter.prototype, 'compare').mockReturnValueOnce(Promise.resolve(true))
      const loginResponse = await request(app).post('/api/login').send({
        email: 'admin@hotmail.com',
        password: 'any'
      })

      const cookies = loginResponse.headers['set-cookie']
      await request.agent(app)
        .post('/api/apprentices')
        .set('Cookie', cookies)
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
        email: 'admin@hotmail.com',
        role: 'admin'
      })
      jest.spyOn(BcryptAdapter.prototype, 'compare').mockReturnValueOnce(Promise.resolve(true))
      const loginResponse = await request(app).post('/api/login').send({
        email: 'admin@hotmail.com',
        password: 'any'
      })
      const cookies = loginResponse.headers['set-cookie']

      await accountsCollection.insertOne({
        name: 'apprentice_name',
        email: 'apprentice_email@hotmail.com'
      })

      await request.agent(app)
        .post('/api/apprentices')
        .set('Cookie', cookies)
        .send({
          name: 'apprentice_name',
          email: 'apprentice_email@hotmail.com',
          trade: 'apprentice_trade',
          advisor: 'apprentice_advisor'
        })
        .expect(403)
    })

    test('Should return 400 if required field is not provided', async () => {
      await accountsCollection.insertOne({
        email: 'admin@hotmail.com',
        role: 'admin'
      })
      jest.spyOn(BcryptAdapter.prototype, 'compare').mockReturnValueOnce(Promise.resolve(true))
      const loginResponse = await request(app).post('/api/login').send({
        email: 'admin@hotmail.com',
        password: 'any'
      })
      const cookies = loginResponse.headers['set-cookie']
      await request(app)
        .post('/api/apprentices')
        .set('Cookie', cookies)
        .send({})
        .expect(400)
    })

    test('Should return 500 transaction fails', async () => {
      await accountsCollection.insertOne({
        email: 'admin@hotmail.com',
        role: 'admin'
      })
      jest.spyOn(BcryptAdapter.prototype, 'compare').mockReturnValueOnce(Promise.resolve(true))
      const loginResponse = await request(app).post('/api/login').send({
        email: 'admin@hotmail.com',
        password: 'any'
      })
      const cookies = loginResponse.headers['set-cookie']

      jest.spyOn(MongoDbTransactionManager.prototype, 'executeTransaction').mockRejectedValueOnce(new Error())
      await request(app)
        .post('/api/apprentices')
        .set('Cookie', cookies)
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
      await accountsCollection.insertOne({
        email: 'admin@hotmail.com',
        role: 'admin'
      })
      jest.spyOn(BcryptAdapter.prototype, 'compare').mockReturnValueOnce(Promise.resolve(true))
      const loginResponse = await request(app).post('/api/login').send({
        email: 'admin@hotmail.com',
        password: 'any'
      })
      const cookies = loginResponse.headers['set-cookie']

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
        .set('Cookie', cookies)
        .expect(204)
    })

    test('Should return 400 if id is invalid', async () => {
      await accountsCollection.insertOne({
        email: 'admin@hotmail.com',
        role: 'admin'
      })
      jest.spyOn(BcryptAdapter.prototype, 'compare').mockReturnValueOnce(Promise.resolve(true))
      const loginResponse = await request(app).post('/api/login').send({
        email: 'admin@hotmail.com',
        password: 'any'
      })
      const cookies = loginResponse.headers['set-cookie']

      const invalidId = 'invalid_id_format'
      await request(app)
        .delete(`/api/apprentices/${invalidId}`)
        .set('Cookie', cookies)
        .expect(400)
    })

    test('Should return 404 if id is linked to any account', async () => {
      await accountsCollection.insertOne({
        email: 'admin@hotmail.com',
        role: 'admin'
      })
      jest.spyOn(BcryptAdapter.prototype, 'compare').mockReturnValueOnce(Promise.resolve(true))
      const loginResponse = await request(app).post('/api/login').send({
        email: 'admin@hotmail.com',
        password: 'any'
      })
      const cookies = loginResponse.headers['set-cookie']

      const randomId = new ObjectId()

      await request(app)
        .delete(`/api/apprentices/${randomId}`)
        .set('Cookie', cookies)
        .expect(404)
    })

    test('Should return 404 if id is not linked to an apprentice role account', async () => {
      await accountsCollection.insertOne({
        email: 'admin@hotmail.com',
        role: 'admin'
      })
      jest.spyOn(BcryptAdapter.prototype, 'compare').mockReturnValueOnce(Promise.resolve(true))
      const loginResponse = await request(app).post('/api/login').send({
        email: 'admin@hotmail.com',
        password: 'any'
      })
      const cookies = loginResponse.headers['set-cookie']

      const account = await accountsCollection.insertOne({
        name: 'apprentice_name',
        email: 'apprentice_email@hotmail.com',
        role: 'admin'
      })

      const accountId = account.insertedId.toString()

      await request(app)
        .delete(`/api/apprentices/${accountId}`)
        .set('Cookie', cookies)
        .expect(404)
    })

    test('Should return 500 if deletion fails', async () => {
      await accountsCollection.insertOne({
        email: 'admin@hotmail.com',
        role: 'admin'
      })
      jest.spyOn(BcryptAdapter.prototype, 'compare').mockReturnValueOnce(Promise.resolve(true))
      const loginResponse = await request(app).post('/api/login').send({
        email: 'admin@hotmail.com',
        password: 'any'
      })
      const cookies = loginResponse.headers['set-cookie']

      const account = await accountsCollection.insertOne({
        name: 'apprentice_name',
        email: 'apprentice_email@hotmail.com',
        role: 'apprentice'
      })

      jest.spyOn(DbDeleteApprenticeAccountById.prototype, 'deleteById').mockReturnValueOnce(Promise.resolve(false))
      const accountId = account.insertedId.toString()
      await request(app)
        .delete(`/api/apprentices/${accountId}`)
        .set('Cookie', cookies)
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

    test('Should return 403 if no token is provided', async () => {
      await request(app)
        .put('/api/apprentice/induction')
        .expect(403)
    })

    test('Should return 404 if accountId is not associated with an apprentice document', async () => {
      await accountsCollection.insertOne({
        name: 'apprentice_name',
        email: 'apprentice@hotmail.com',
        role: 'apprentice',
        password: 'valid_password'
      })

      jest.spyOn(BcryptAdapter.prototype, 'compare').mockReturnValueOnce(Promise.resolve(true))
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'apprentice@hotmail.com',
          password: 'valid_password'
        })

      const cookies = response.headers['set-cookie']

      const agent = request.agent(app)
      await agent
        .put('/api/apprentice/induction')
        .set('Cookie', cookies)
        .expect(404)
    })

    test('Should return 500 if one use case fails', async () => {
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
      const cookies = response.headers['set-cookie']
      jest.spyOn(DbUpdateApprenticeInduction.prototype, 'updateInduction').mockImplementationOnce(async () => { throw new Error() })
      const agent = request.agent(app)
      await agent
        .put('/api/apprentice/induction')
        .set('Cookie', cookies)
        .expect(500)
    })
  })

  describe('PATCH /apprentice/assessment', () => {
    const requestBody = {
      answers: {
        question1: 'A',
        question2: 'B',
        question3: 'C',
        question4: 'D',
        question5: 'A'
      }
    }

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
        induction: true,
        assessment: false,
        updatedAt: null
      })
      jest.spyOn(BcryptAdapter.prototype, 'compare').mockReturnValueOnce(Promise.resolve(true))
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'apprentice@hotmail.com',
          password: 'valid_password'
        })

      const cookies = response.headers['set-cookie']

      const agent = request.agent(app)
      await agent
        .patch('/api/apprentice/assessment')
        .set('Cookie', cookies)
        .send(requestBody)
        .expect(204)

      const apprenticeDocument = await apprenticesCollection.findOne<ApprenticeModel>({ accountId: new ObjectId(accountId) })
      expect(apprenticeDocument.assessment).toBe(true)
      expect(apprenticeDocument.updatedAt).toBeTruthy()
    })

    test('Should return 403 if no token is provided', async () => {
      await request(app)
        .patch('/api/apprentice/assessment')
        .expect(403)
    })

    test('Should return 400 if req.body is empty', async () => {
      await accountsCollection.insertOne({
        name: 'apprentice_name',
        email: 'apprentice@hotmail.com',
        role: 'apprentice',
        password: 'valid_password'
      })

      jest.spyOn(BcryptAdapter.prototype, 'compare').mockReturnValueOnce(Promise.resolve(true))
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'apprentice@hotmail.com',
          password: 'valid_password'
        })

      const cookies = response.headers['set-cookie']
      const agent = request.agent(app)
      await agent
        .patch('/api/apprentice/assessment')
        .set('Cookie', cookies)
        .send({})
        .expect(404)
    })

    test('Should return 400 if answers has invalid answer', async () => {
      await accountsCollection.insertOne({
        name: 'apprentice_name',
        email: 'apprentice@hotmail.com',
        role: 'apprentice',
        password: 'valid_password'
      })

      jest.spyOn(BcryptAdapter.prototype, 'compare').mockReturnValueOnce(Promise.resolve(true))
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'apprentice@hotmail.com',
          password: 'valid_password'
        })

      const cookies = response.headers['set-cookie']
      const agent = request.agent(app)
      await agent
        .patch('/api/apprentice/assessment')
        .set('Cookie', cookies)
        .send({
          answers: {
            ...requestBody.answers,
            question3: 'X'
          }
        })
        .expect(404)
    })

    test('Should return 404 if accountId is not associated with an apprentice document', async () => {
      await accountsCollection.insertOne({
        name: 'apprentice_name',
        email: 'apprentice@hotmail.com',
        role: 'apprentice',
        password: 'valid_password'
      })

      jest.spyOn(BcryptAdapter.prototype, 'compare').mockReturnValueOnce(Promise.resolve(true))
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'apprentice@hotmail.com',
          password: 'valid_password'
        })

      const cookies = response.headers['set-cookie']
      const agent = request.agent(app)
      await agent
        .patch('/api/apprentice/assessment')
        .set('Cookie', cookies)
        .send(requestBody)
        .expect(404)
    })

    test('Should return 500 if one use case fails', async () => {
      const account = await accountsCollection.insertOne({
        name: 'apprentice_name',
        email: 'apprentice@hotmail.com',
        role: 'apprentice',
        password: 'valid_password'
      })
      const accountId = account.insertedId.toString()
      await apprenticesCollection.insertOne({
        accountId: new ObjectId(accountId),
        induction: true,
        assessment: false,
        updatedAt: null
      })

      jest.spyOn(BcryptAdapter.prototype, 'compare').mockReturnValueOnce(Promise.resolve(true))
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'apprentice@hotmail.com',
          password: 'valid_password'
        })
      const cookies = response.headers['set-cookie']
      jest.spyOn(DbUpdateApprenticeAssessment.prototype, 'updateAssessment').mockImplementationOnce(async () => { throw new Error() })
      const agent = request.agent(app)
      await agent
        .patch('/api/apprentice/assessment')
        .set('Cookie', cookies)
        .send(requestBody)
        .expect(500)
    })
  })

  describe('GET /apprentices with date params', () => {
    test('Should return 200 with apprentices within the given date range', async () => {
      await accountsCollection.insertOne({
        name: 'admin',
        email: 'admin@hotmail.com',
        role: 'admin',
        password: 'valid_password'
      })

      jest.spyOn(BcryptAdapter.prototype, 'compare').mockReturnValueOnce(Promise.resolve(true))
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'admin@hotmail.com',
          password: 'valid_password'
        })
      const cookies = response.headers['set-cookie']

      const ap1 = await accountsCollection.insertOne({
        name: 'apprentice1',
        email: 'ap1@hotmail.com',
        role: 'apprentice',
        createdAt: new Date('2024-01-01')
      })

      await apprenticesCollection.insertOne({
        accountId: new ObjectId(ap1.insertedId.toString())
      })

      const ap2 = await accountsCollection.insertOne({
        name: 'apprentice2',
        email: 'ap2@hotmail.com',
        role: 'apprentice',
        createdAt: new Date('2024-02-01')
      })

      await apprenticesCollection.insertOne({
        accountId: new ObjectId(ap2.insertedId.toString())
      })

      const startDate = '01-01-2024'
      const endDate = '02-15-2024'

      const agent = request.agent(app)
      const res = await agent
        .get(`/api/apprentices?startDate=${startDate}&endDate=${endDate}`)
        .set('Cookie', cookies)
        .expect(200)

      expect(res.body).toHaveLength(2)
    })

    test('Should return 400 if date range is invalid', async () => {
      const startDate = 'invalid_date'
      const endDate = '2023-02-15'

      await accountsCollection.insertOne({
        name: 'admin_name',
        email: 'admin@hotmail.com',
        role: 'admin',
        password: 'valid_password'
      })

      jest.spyOn(BcryptAdapter.prototype, 'compare').mockReturnValueOnce(Promise.resolve(true))
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'admin@hotmail.com',
          password: 'valid_password'
        })
      const cookies = response.headers['set-cookie']
      await request(app)
        .get(`/api/apprentices?startDate=${startDate}&endDate=${endDate}`)
        .set('Cookie', cookies)
        .expect(400)
    })
  })

  describe('GET /apprentice', () => {
    test('Should return 200 with apprentice details', async () => {
      const apprentice = await accountsCollection.insertOne({
        name: 'apprentice1',
        email: 'apprentice1@hotmail.com',
        role: 'apprentice',
        password: 'valid_password'
      })

      const apprenticeId = apprentice.insertedId.toString()

      await apprenticesCollection.insertOne({
        accountId: new ObjectId(apprenticeId),
        trade: 'trade1',
        advisor: 'advisor1'
      })
      jest.spyOn(BcryptAdapter.prototype, 'compare').mockReturnValueOnce(Promise.resolve(true))
      const loginResponse = await request(app)
        .post('/api/login')
        .send({
          email: 'apprentice1@hotmail.com',
          password: 'valid_password'
        })
      const cookies = loginResponse.headers['set-cookie']

      const response = await request.agent(app)
        .get('/api/apprentice')
        .set('Cookie', cookies)
        .expect(200)

      expect(response.body).toEqual(
        {
          trade: 'trade1',
          advisor: 'advisor1'
        }
      )
    })

    test('Should return 500 if fetching details fails', async () => {
      const apprentice = await accountsCollection.insertOne({
        name: 'apprentice1',
        email: 'apprentice1@hotmail.com',
        role: 'apprentice',
        password: 'valid_password'
      })

      const apprenticeId = apprentice.insertedId.toString()

      await apprenticesCollection.insertOne({
        accountId: new ObjectId(apprenticeId),
        trade: 'trade1',
        advisor: 'advisor1'
      })
      jest.spyOn(BcryptAdapter.prototype, 'compare').mockReturnValueOnce(Promise.resolve(true))
      const loginResponse = await request(app)
        .post('/api/login')
        .send({
          email: 'apprentice1@hotmail.com',
          password: 'valid_password'
        })
      const cookies = loginResponse.headers['set-cookie']
      jest.spyOn(AccountMongoRepository.prototype, 'loadById').mockImplementationOnce(() => {
        throw new Error()
      })

      await request.agent(app)
        .get('/api/apprentice')
        .set('Cookie', cookies)
        .expect(500)
    })
  })
})
