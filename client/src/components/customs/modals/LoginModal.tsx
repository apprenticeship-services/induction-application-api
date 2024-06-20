import {
  Dialog,
  DialogContent,
  //   DialogDescription,
  DialogHeader,
  //   DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import LoginForm from '../forms/login/LoginForm'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function LoginModal () {
  return (
    <Dialog modal >
    <DialogTrigger asChild>
    <Button variant={'outline'} className='gap-1 w-full text-black' size={'sm'}>
      <ArrowRight size={18}/>
      Login
    </Button>
    </DialogTrigger>
    <DialogContent >
      <DialogHeader className='px-2 text-left'>
            <LoginForm/>
      </DialogHeader>
    </DialogContent>
  </Dialog>

  )
}
