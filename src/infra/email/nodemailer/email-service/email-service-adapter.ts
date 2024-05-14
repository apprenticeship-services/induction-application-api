import { RegistrationEmailService, RegistrationEmailServiceParams } from '@/data/protocols/email/registration-email-service'
import { NodemailerHelper } from '../helpers/nodemailer-helper'
import env from '@/main/config/env'
import { NodemailerMessage } from '../types/nodemailer-message'
import { TemplateEmailRegistrationGenerator } from '@/data/protocols/email/template-email-registration-generator'

export class EmailServiceAdapter implements RegistrationEmailService {
  constructor (private readonly templateGenerator: TemplateEmailRegistrationGenerator) {
    this.templateGenerator = templateGenerator
  }

  async sendRegistrationMail (accountData: RegistrationEmailServiceParams): Promise<void> {
    return new Promise((resolve, reject) => {
      const template = this.templateGenerator.generateRegistrationEmailTemplate(accountData)
      const message: NodemailerMessage = {
        from: `"Apprenticeship Services Bishopstown "<${env.emailServiceUser}>`,
        to: accountData.emailTo,
        subject: template.header,
        html: template.content
      }
      NodemailerHelper.initMail().sendMail(message, (error) => {
        if (error) {
          reject(error)
        }
        resolve(null)
      })
    })
  }
}
