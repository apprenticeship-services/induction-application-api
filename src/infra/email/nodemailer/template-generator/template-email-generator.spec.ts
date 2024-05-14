import { TemplateEmailGenerator } from './template-email-generator'

const fakeAdminAccount = () => ({
  name: 'any_name',
  emailTo: 'any_email@hotmail.com',
  password: 'any_password',
  role: 'admin'
})
describe('Template Email Generator', () => {
  describe('Registration Email Template', () => {
    test('Should return a header and content if account is for admin', () => {
      const sut = new TemplateEmailGenerator()
      const template = sut.generateRegistrationEmailTemplate(fakeAdminAccount())
      expect(template.header).toBeDefined()
      expect(template.content).toBeDefined()
    })
  })
})
