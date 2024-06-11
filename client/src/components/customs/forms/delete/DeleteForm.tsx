/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { deleteAccountSchema, DeleteAccountModel } from '@/schemas/account/deleteAccountSchema'

import { useDeleteAccount } from '@/hooks/account/useDeleteAccount'

type DeleteAccountProps = {
    accountId: string,
    role: 'admin' | 'apprentice',
    changeDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export function DeleteForm ({ accountId, role, changeDialogOpen }: DeleteAccountProps) {
  const { mutateAsync, isPending } = useDeleteAccount()
  const form = useForm<DeleteAccountModel>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      delete: ''
    }
  })

  const onSubmit = (): void => {
    const promise = mutateAsync({
      accountId,
      role
    })
    toast.promise(promise, {
      loading: 'Deleting account...',
      success: () => {
        form.reset()
        changeDialogOpen(false)
        return 'Account was deleted'
      },
      error: (error) => {
        console.log(error)
        if (error.response && error.response.data && error.response.data.error) {
          return error.response.data.error
        }
        return 'Error while deleting account'
      }
    })
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 py-5">
                <FormField
                control={form.control}
                 name="delete"
                      disabled={isPending}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-red-600">Type "DELETE" to complete action.</FormLabel>
                    <FormControl>
                        <Input {...field}/>
                    </FormControl>
                    <FormMessage className='italic font-normal' />
                    </FormItem>
                )}
                    />
              </div>
              <div className='flex'>
              <Button variant={'destructive'} type="submit" disabled={(isPending || !form.formState.isValid)} className='w-[75%] mx-auto'>
                  {isPending ? 'Deleting account...' : 'Confirm'}
            </Button>
              </div>
        </form>
    </Form>
  )
}
