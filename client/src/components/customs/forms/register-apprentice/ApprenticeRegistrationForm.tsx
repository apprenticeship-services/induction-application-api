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
import { ApprenticeRegistrationModel, apprenticeSchema } from '@/schemas/apprentice/apprenticeSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRegisterApprentice } from '@/hooks/apprentice/useRegisterApprentice'

export function ApprenticeRegistrationForm () {
  const { mutateAsync, isPending } = useRegisterApprentice()
  const form = useForm<ApprenticeRegistrationModel>({
    resolver: zodResolver(apprenticeSchema),
    defaultValues: {
      name: '',
      email: '',
      trade: '',
      advisor: ''
    }
  })

  const onSubmit: SubmitHandler<ApprenticeRegistrationModel> = (
    data
  ): void => {
    const promise = mutateAsync(data)
    toast.promise(promise, {
      loading: 'Registering apprentice...',
      success: () => {
        form.reset()
        return 'New apprentice registered'
      },
      error: (error) => {
        console.log(error)
        if (error.response && error.response.data && error.response.data.error) {
          return error.response.data.error
        }
        return 'Error registering apprentice'
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
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Apprentice Name</FormLabel>
                    <FormControl>
                        <Input disabled={isPending} placeholder="Name..." {...field} />
                    </FormControl>
                    <FormMessage className='italic font-normal' />
                    </FormItem>
                )}
                    />
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Apprentice Email</FormLabel>
                    <FormControl>
                        <Input disabled={isPending} placeholder="Email..." {...field} />
                    </FormControl>
                    <FormMessage className='italic font-normal' />
                    </FormItem>
                )}
                    />
                <FormField
                control={form.control}
                name="trade"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Trade</FormLabel>
                    <FormControl>
                        <Input disabled={isPending} placeholder="Trade..." {...field} />
                    </FormControl>
                    <FormMessage className='italic font-normal' />
                    </FormItem>
                )}
                    />
                <FormField
                control={form.control}
                name="advisor"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Advisor</FormLabel>
                    <FormControl>
                        <Input disabled={isPending} placeholder="Advisor.." {...field} />
                    </FormControl>
                    <FormMessage className='italic font-normal' />
                    </FormItem>
                )}
                />
              </div>
              <div className='flex'>
              <Button type="submit" disabled={isPending} className='w-[75%] mx-auto'>
                  {isPending ? 'Registering new apprentice...' : 'Submit'}
            </Button>
              </div>
        </form>
    </Form>
  )
}
