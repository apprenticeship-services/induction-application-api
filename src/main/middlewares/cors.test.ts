import request from 'supertest'
import app from '@/main/config/app'
import env from '@/main/config/env'

describe('CORS Middleware', () => {
  beforeAll(() => {
    env.nodeEnvironment = 'development'
  })

  test('Should enable CORS with appropriate headers in development mode', async () => {
    app.get('/cors_test', (req, res) => {
      res.send()
    })

    const origin = 'http://127.0.0.1:8081'

    const response = await request(app)
      .get('/cors_test')
      .set('Origin', origin)

    expect(response.headers['access-control-allow-origin']).toBe(origin)
    expect(response.headers['access-control-allow-credentials']).toBe('true')
    expect(response.headers['access-control-allow-headers']).toBe('Content-Type, Set-Cookie')
    expect(response.headers['access-control-allow-methods']).toBe('PUT, POST, GET, DELETE, PATCH')
  })

  test('Should enable CORS with appropriate headers in production mode', async () => {
    process.env.NODE_ENV = 'production'

    const origin = 'http://127.0.0.1:8081'
    const allowedOrigins = ['http://127.0.0.1:8081', 'http://localhost:8081']

    if (allowedOrigins.includes(origin)) {
      const response = await request(app)
        .get('/cors_test')
        .set('Origin', origin)

      expect(response.headers['access-control-allow-origin']).toBe(origin)
      expect(response.headers['access-control-allow-credentials']).toBe('true')
      expect(response.headers['access-control-allow-headers']).toBe('Content-Type, Set-Cookie')
      expect(response.headers['access-control-allow-methods']).toBe('PUT, POST, GET, DELETE, PATCH')
    }
  })
})
