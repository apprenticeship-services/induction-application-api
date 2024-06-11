import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { AdminModel } from '@/schemas/types/AdminModel'

type AdminInformationProps = {
    admin:AdminModel
}

export function AdminInformation ({ admin }: AdminInformationProps) {
  const date = new Date(admin.createdAt)
  const adminDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  return (
    <Dialog >
        <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            View Information
            </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Admin Information</DialogTitle>
          <DialogDescription>
            Below you can find the following admin information:
          </DialogDescription>
        </DialogHeader>
            <ul className='text-base flex flex-col gap-2'>
                <li className='font-bold'>Name: <span className='font-normal pl-2'>{admin.name}</span></li>
                <li className='font-bold'>Email: <span className='font-normal pl-2'>{admin.email}</span></li>
                <li className='font-bold'>Registered At: <span className='font-normal pl-2'>{adminDate}</span></li>
            </ul>
      </DialogContent>
    </Dialog>
  )
}
