import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'
import { hash } from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import env from '../config/env'
import { UserJwtPayload } from '@/presentation/protocols/token-payload'

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

    test('Should return 401 if password does not match registered account', async () => {
      const password = await hash('test_password', env.salt)
      await accountsCollection.insertOne({
        name: 'test_name',
        email: 'test_email@hotmail.com',
        role: 'test_role',
        createdAt: new Date(),
        password
      })

      await request(app)
        .post('/api/login')
        .send({
          email: 'test_email@hotmail.com',
          password: 'invalid_password'
        })
        .expect(401)
    })

    test('Should return 200 if password matches registered account and have token on headers', async () => {
      const password = await hash('test_password', env.salt)
      const account = await accountsCollection.insertOne({
        name: 'test_name',
        email: 'test_email@hotmail.com',
        role: 'test_role',
        createdAt: new Date(),
        password
      })

      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'test_email@hotmail.com',
          password: 'test_password'
        })
        .expect(200)
      expect(response.headers['set-cookie']).toBeDefined()
      expect(response.headers['set-cookie'][0]).toMatch(/token=/)
      expect(response.headers['set-cookie'][0]).toMatch(/HttpOnly/)
      expect(response.headers['set-cookie'][0]).toMatch(/Secure/)

      const tokenMatch = response.headers['set-cookie'][0].match(/token=([^;]+)/)
      expect(tokenMatch).toBeDefined()
      const token = tokenMatch[1]
      expect(token).toBeTruthy()

      const secretKey = env.jwtSecretToken
      const decodedToken = jwt.verify(token, secretKey) as UserJwtPayload
      expect(decodedToken).toBeDefined()
      expect(decodedToken._id).toBe(account.insertedId.toString())
      expect(decodedToken.role).toBe('test_role')
    })
  })
})
