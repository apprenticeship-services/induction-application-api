import { z } from 'zod'
export const apprenticeSchema = z.object({
  name: z.string().trim().min(1, { message: 'Apprentice name is required.' }),
  email: z.string().min(1, { message: 'Email is required.' }).email({
    message: 'Must be a valid email.'
  }),
  advisor: z.string().trim().min(1, { message: 'Advisor name is required.' }),
  trade: z.string().trim().min(1, { message: 'Trade is required.' })
})

export type ApprenticeRegistrationModel = z.infer<typeof apprenticeSchema>
