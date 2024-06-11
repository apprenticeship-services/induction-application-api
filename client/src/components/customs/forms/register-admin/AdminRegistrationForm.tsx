/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { AdminRegistrationModel, adminSchema } from '@/schemas/admin/adminSchema'
import { useRegisterAdmin } from '@/hooks/admin/useRegisterAdmin'
import { Checkbox } from '@/components/ui/checkbox'

export function AdminRegistrationForm () {
  const { mutateAsync, isPending } = useRegisterAdmin()
  const form = useForm<AdminRegistrationModel>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: '',
      email: '',
      option: false
    }
  })

  const onSubmit: SubmitHandler<AdminRegistrationModel> = (
    data
  ): void => {
    const promise = mutateAsync({
      name: data.name,
      email: data.email
    })
    toast.promise(promise, {
      loading: 'Registering admin...',
      success: () => {
        form.reset()
        return 'New admin registered'
      },
      error: (error) => {
        console.log(error)
        if (error.response && error.response.data && error.response.data.error) {
          return error.response.data.error
        }
        return 'Error registering admin'
      }
    })
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 py-5">
                <FormField
                control={form.control}
                 name="name"
                disabled={isPending}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Admin Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Name..." {...field} />
                    </FormControl>
                    <FormMessage className='italic font-normal' />
                    </FormItem>
                )}
                    />
                <FormField
                control={form.control}
                name="email"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Email</FormLabel>
                    <FormControl>
                        <Input placeholder="Email..." {...field} />
                    </FormControl>
                    <FormMessage className='italic font-normal' />
                  </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="option"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Register this account as admin
                      </FormLabel>
                      <FormDescription>
                        I agree to give permission to this account to manage apprentices actions.
                      </FormDescription>
                      <FormMessage className='italic font-normal' />
                    </div>
                  </FormItem>
                )}
              />
              </div>
              <div className='flex'>
              <Button type="submit" disabled={isPending} className='w-[75%] mx-auto'>
                  {isPending ? 'Registering new admin...' : 'Submit'}
            </Button>
              </div>
        </form>
    </Form>
  )
}
