import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AdminRegistrationForm } from '../forms/register-admin/AdminRegistrationForm'
import { Plus } from 'lucide-react'
export const AdminRegistrationModal = () => {
  return (
        <Dialog >
        <DialogTrigger asChild>
        <Button variant={'outline'} className='gap-1' size={'sm'}>
          <Plus size={18}/>
          New admin
        </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register Admin</DialogTitle>
            <DialogDescription>
              To register a new admin, enter the required details below and click submit. Make sure to check the checkbox!
            </DialogDescription>
            <AdminRegistrationForm/>
          </DialogHeader>
        </DialogContent>
      </Dialog>
  )
}
