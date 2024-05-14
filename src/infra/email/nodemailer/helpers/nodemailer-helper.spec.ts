import { NodemailerHelper } from './nodemailer-helper'
import { createTransport } from 'nodemailer'
let transporter

describe('Nodemailer Helper', () => {
  beforeAll(() => {
    transporter = NodemailerHelper.initMail()
  })
  test('Should create Mail Transporter on init method', () => {
    expect(transporter).toBeDefined()
    expect(transporter).toHaveProperty('sendMail')
    expect(transporter.sendMail).toBeInstanceOf(Function)
  })
})
