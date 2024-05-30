import { CardTitle, CardDescription, CardHeader, CardContent, Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useLogin } from '@/hooks/login/useLogin'
import { LoginModel, loginSchema } from '@/schemas/login/loginSchema'
import { Spinner } from '../../spinner/Spinner'
import { useNavigate } from 'react-router-dom'

export default function LoginForm () {
  const { mutateAsync, isPending, isError } = useLogin()
  const navigate = useNavigate()
  const form = useForm<LoginModel>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit: SubmitHandler<LoginModel> = async (
    data
  ): Promise<void> => {
    const promise = mutateAsync({
      email: data.email,
      password: data.password
    })
    toast.promise(promise, {
      loading: 'Checking your credentials...',
      success: () => {
        form.reset()
        navigate('/apprentices')
        return 'You are logged in!'
      },
      error: () => {
        return 'Invalid Username or Password'
      }
    })
  }
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription>Enter your email and password to login to your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          {isError && <p className='text-destructive text-center font-medium'>Invalid Username or Password</p>}
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-4 pb-4">
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input disabled={isPending} placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage className='italic font-normal' />
                        </FormItem>
                    )}
                        />
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input disabled={isPending} placeholder="Enter your password" {...field} type='password' />
                        </FormControl>
                        <FormMessage className='italic font-normal' />
                    </FormItem>
                    )}
                    />
                </div>
                <div className='flex'>
                <Button type="submit" disabled={isPending} className='w-[75%] mx-auto'>
                {isPending
                  ? <>
                  <Spinner />{'Checking credentials...'}
                  </>
                  : 'Login'}
                </Button>
                </div>
            </form>
        </Form>
      </CardContent>
    </Card>
  )
}
