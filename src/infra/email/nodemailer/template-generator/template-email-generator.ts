import { RegistrationEmailServiceParams } from '@/data/protocols/email/registration-email-service'
import { TemplateEmailRegistrationContent, TemplateEmailRegistrationGenerator } from '@/data/protocols/email/template-email-registration-generator'

export class TemplateEmailGenerator implements TemplateEmailRegistrationGenerator {
  generateRegistrationEmailTemplate (accountData: RegistrationEmailServiceParams): TemplateEmailRegistrationContent {
    const { role } = accountData

    let header = ''
    let content = ''
    if (role === 'admin') {
      header = 'Admin credentials for CETB Apprenticeship Services'
      content = `<h1>Admin credentials for CETB Apprenticeship Services</h1>
      <p>Dear ${accountData.name},</p>
      <p>You have been successfully registered as an ADMIN at CETB Bishopstown Campus Apprenticeship Services.</p>
      <p>Here are your credentials to access our app:</p>
      <p> <b>Email: </b>${accountData.emailTo} </p>
      <p> <b>Password: </b>${accountData.password}</p>
      </br>
      <p>Access our app through the link: <a href="https://cetb-apprenticeship-services.vercel.app/">cetb-apprenticeship-services.vercel.app</a></p>
      </br> 
      <p>Yours sincerely, <span><strong>Apprenticeship Services Team.</strong></span></p>
      `
    }

    if (role === 'apprentice') {
      header = 'Apprentice registration credentials'
      content = `<h1>Apprentice registration credentials</h1>
      <p>Dear ${accountData.name},</p> 
      <p>You have been successfully registered as an apprentice at CETB Bishopstown Campus Apprenticeship Services.</p>
      <p>Here are your credentials to access our app and complete your online induction:</p>
      <p> <b>Email: </b>${accountData.emailTo} </p>
      <p> <b>Password: </b>${accountData.password}</p>
      </br>
      <p>Access our app through the link: <a href="https://cetb-apprenticeship-services.vercel.app/">cetb-apprenticeship-services.vercel.app</a></p>
      </br> 
      <p>Yours sincerely, <span><strong>Apprenticeship Services Team.</strong></span></p>
      `
    }

    return {
      header,
      content
    }
  }
}
