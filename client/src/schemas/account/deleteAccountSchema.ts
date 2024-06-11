import { z } from 'zod'

export const deleteAccountSchema = z.object({
  delete: z.string().refine((value) => value === 'DELETE', {
    message: "You must type 'DELETE' to confirm deletion."
  })
})

export type DeleteAccountModel = z.infer<typeof deleteAccountSchema>
