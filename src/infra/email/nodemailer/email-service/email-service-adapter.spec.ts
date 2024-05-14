import { EmailServiceAdapter } from './email-service-adapter'
import { RegistrationEmailServiceParams } from '@/data/protocols/email/registration-email-service'
import { NodemailerMessage } from '../types/nodemailer-message'
import env from '@/main/config/env'
import { TemplateEmailRegistrationContent, TemplateEmailRegistrationGenerator } from '@/data/protocols/email/template-email-registration-generator'

const sendMailMock = jest.fn((message, callback) => callback(null))
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockImplementation(() => ({
    sendMail: sendMailMock
  }))
}))

type Sut = {
  sut: EmailServiceAdapter,
  templateEmailRegistrationGeneratorStub: TemplateEmailRegistrationGenerator
}
const makeSut = (): Sut => {
  const templateEmailRegistrationGeneratorStub = makeTemplateEmailRegistrationGeneratorStub()
  const sut = new EmailServiceAdapter(templateEmailRegistrationGeneratorStub)
  return {
    sut,
    templateEmailRegistrationGeneratorStub
  }
}

const makeTemplateEmailRegistrationGeneratorStub = (): TemplateEmailRegistrationGenerator => {
  class TemplateEmailRegistrationGeneratorStub implements TemplateEmailRegistrationGenerator {
    generateRegistrationEmailTemplate (accountData: RegistrationEmailServiceParams): TemplateEmailRegistrationContent {
      return fakeRegistrationTemplate()
    }
  }
  return new TemplateEmailRegistrationGeneratorStub()
}
const fakeRegistrationEmailObject = (): RegistrationEmailServiceParams => ({
  emailTo: 'any_email@hotmail.com',
  name: 'any_name',
  password: 'any_password',
  role: 'admin'
})

const fakeRegistrationTemplate = (): TemplateEmailRegistrationContent => ({
  header: 'any_header',
  content: 'any_content'
})

const fakeMessage = (): NodemailerMessage => ({
  from: `"Apprenticeship Services Bishopstown "<${env.emailServiceUser}>`,
  to: 'any_email@hotmail.com',
  subject: 'any_header',
  html: 'any_content'
})
describe('EmailServiceAdapter', () => {
  test('Should call NodemailerHelper sendMail with correct values', async () => {
    const { sut } = makeSut()
    await sut.sendRegistrationMail(fakeRegistrationEmailObject())
    expect(sendMailMock).toHaveBeenCalledWith(fakeMessage(), expect.any(Function))
  })
})
