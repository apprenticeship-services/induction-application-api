import request from 'supertest'
import app from '../config/app'

describe('Login Route', () => {
  describe('Sign Up', () => {
    test('Should call endpoint', async () => {
      await request(app)
        .get('/api/hello')
        .expect(200)
    })
  })
})
