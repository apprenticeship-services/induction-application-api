import request from 'supertest'
import app from '../config/app'

describe('Content-Type', () => {
  test('Should confirm Content-Type to be json', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send()
    })

    await request(app)
      .get('/test_content_type')
      .expect('Content-Type', /json/)
  })

  test('Should confirm Content-Type to be json', async () => {
    app.get('/test_content_type_html_forced', (req, res) => {
      res.type('html')
      res.send()
    })

    await request(app)
      .get('/test_content_type_html_forced')
      .expect('Content-Type', /html/)
  })
})
