import { RegistrationEmailService, RegistrationEmailServiceParams } from '@/data/protocols/email/registration-email-service'
import { NodemailerHelper } from '../helpers/nodemailer-helper'
import env from '@/main/config/env'
import { NodemailerMessage } from '../types/nodemailer-message'
import { TemplateEmailRegistrationGenerator } from '@/data/protocols/email/template-email-registration-generator'
import path from 'path'

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
        html: template.content,
        attachments: accountData.role === 'admin'
          ? []
          : [
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
