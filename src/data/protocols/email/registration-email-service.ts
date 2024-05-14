export type RegistrationEmailServiceParams = {
     emailTo: string,
     password: string,
     role: string
}

export interface RegistrationEmailService{
     sendRegistrationMail(data: RegistrationEmailServiceParams): Promise<void>
}
