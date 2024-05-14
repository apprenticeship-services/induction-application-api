import { RegistrationEmailServiceParams } from './registration-email-service'

export type TemplateEmailRegistrationContent = {
    header: string,
    content: string
}

export interface TemplateEmailRegistrationGenerator{
    generateRegistrationEmailTemplate(accountData:RegistrationEmailServiceParams): TemplateEmailRegistrationContent
}
