export type RegistrationEmailServiceParams = {
     name: string,
     emailTo: string,
     password: string,
     role: string
}

export interface RegistrationEmailService{
     sendRegistrationMail(accountData: RegistrationEmailServiceParams): Promise<void>
}
