import { z } from 'zod'

export const adminSchema = z.object({
  name: z.string().min(1, { message: 'Admin name is required.' }),
  email: z
    .string()
    .min(1, { message: 'Email is required.' })
    .email({ message: 'Email must be valid.' }),
  option: z.boolean().refine(val => val === true, {
    message: 'You must check the checkbox to register new admin.'
  })
})

export type AdminRegistrationModel = z.infer<typeof adminSchema>
export type AdminModel = {
  name: string;
  email: string;
  accountId:string,
  role: string,
  createdAt:string
}
