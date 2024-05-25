import { EmailServiceAdapter } from './email-service-adapter'
import { RegistrationEmailServiceParams } from '@/data/protocols/email/registration-email-service'
import { NodemailerMessage } from '../types/nodemailer-message'
import env from '@/main/config/env'
import { TemplateEmailRegistrationContent, TemplateEmailRegistrationGenerator } from '@/data/protocols/email/template-email-registration-generator'
import path from 'path'

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

const fakeMessageForAdmin = (): NodemailerMessage => ({
  from: `"Apprenticeship Services Bishopstown "<${env.emailServiceUser}>`,
  to: 'any_email@hotmail.com',
  subject: 'any_header',
  html: 'any_content',
  attachments: []
})

const fakeMessageForApprentice = (): NodemailerMessage => ({
  from: `"Apprenticeship Services Bishopstown "<${env.emailServiceUser}>`,
  to: 'any_email@hotmail.com',
  subject: 'any_header',
  html: 'any_content',
  attachments: [
    {
      filename: 'Apprentice_Support_Induction.pdf',
      path: path.join(__dirname, '../../../../../assets/documents/Apprentice_Support_Induction.pdf'),
      contentType: 'application/pdf'
    },
    {
      filename: 'Apprentice-Guide-To-Assessment.pdf',
      path: path.join(__dirname, '../../../../../assets/documents/Apprentice-Guide-To-Assessment.pdf'),
      contentType: 'application/pdf'
    },
    {
      filename: 'Apprenticeship_Code_Of_Practice.pdf',
      path: path.join(__dirname, '../../../../../assets/documents/Apprenticeship_Code_Of_Practice.pdf'),
      contentType: 'application/pdf'
    },
    {
      filename: 'Health_Safety_Booklet.pdf',
      path: path.join(__dirname, '../../../../../assets/documents/Health_Safety_Booklet.pdf'),
      contentType: 'application/pdf'
    },
    {
      filename: 'Hearing _HSA_Information.pdf',
      path: path.join(__dirname, '../../../../../assets/documents/Hearing _HSA_Information.pdf'),
      contentType: 'application/pdf'
    }
  ]
})
describe('EmailServiceAdapter', () => {
  test('Should call NodemailerHelper sendMail with correct values if admin', async () => {
    const { sut } = makeSut()
    await sut.sendRegistrationMail(fakeRegistrationEmailObject())
    expect(sendMailMock).toHaveBeenCalledWith(fakeMessageForAdmin(), expect.any(Function))
  })

  test('Should call NodemailerHelper sendMail with correct values if apprentice', async () => {
    const { sut } = makeSut()
    await sut.sendRegistrationMail({
      ...fakeRegistrationEmailObject(),
      role: 'apprentice'
    })
    expect(sendMailMock).toHaveBeenCalledWith(fakeMessageForApprentice(), expect.any(Function))
  })

  test('should throw an error if sendMail fails', async () => {
    const { sut } = makeSut()
    sendMailMock.mockImplementationOnce((message: NodemailerMessage, callback: (error: Error | null) => void) => {
      callback(new Error())
    })
    const emailResult = sut.sendRegistrationMail(fakeRegistrationEmailObject())

    expect(emailResult).rejects.toThrow()
  })

  test('Should return null on success', async () => {
    const { sut } = makeSut()
    const emailResult = await sut.sendRegistrationMail(fakeRegistrationEmailObject())
    expect(emailResult).toBeNull()
  })
})
