import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ApprenticeRegistrationForm } from '../forms/register-apprentice/ApprenticeRegistrationForm'
import { Plus } from 'lucide-react'
export const ApprenticeRegistrationModal = () => {
  return (
        <Dialog modal >
        <DialogTrigger asChild>
        <Button variant={'outline'} className='gap-1' size={'sm'}>
          <Plus size={18}/>
          New Apprentice
        </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register Apprentice</DialogTitle>
            <DialogDescription>
              To register a new apprentice, enter the required details below and click submit.
            </DialogDescription>
            <ApprenticeRegistrationForm/>
          </DialogHeader>
        </DialogContent>
      </Dialog>
  )
}
