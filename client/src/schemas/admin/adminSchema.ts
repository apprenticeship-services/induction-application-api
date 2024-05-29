import { z } from 'zod'

export const adminSchema = z.object({
  name: z.string().min(1, { message: 'Admin name is required.' }),
  email: z
    .string()
    .min(1, { message: 'Email is required.' })
    .email({ message: 'Email must be valid.' }),
  option: z.literal(true, {
    errorMap: () => ({
      message: 'You must check the checkbox to register new admin.'
    })
  })
})

export type AdminRegistrationModel = z.infer<typeof adminSchema>
export type AdminModel = Omit<z.infer<typeof adminSchema>, 'option'>
