import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { ApprenticeModel } from '@/schemas/types/ApprenticeModel'

type ApprenticeInformationProps = {
    apprentice:ApprenticeModel
}

export function ApprenticeInformation ({ apprentice }: ApprenticeInformationProps) {
  const date = new Date(apprentice.createdAt)
  const apprenticeDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  return (
    <Dialog >
        <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            View Information
            </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apprentice Information</DialogTitle>
          <DialogDescription>
            Below you can find the following apprentice information:
          </DialogDescription>
        </DialogHeader>
            <ul className='text-base flex flex-col gap-2'>
                <li className='font-bold'>Name: <span className='font-normal pl-2'>{apprentice.name}</span></li>
                <li className='font-bold'>Email: <span className='font-normal pl-2'>{apprentice.email}</span></li>
                <li className='font-bold'>Trade: <span className='font-normal pl-2'>{apprentice.trade}</span></li>
                <li className='font-bold'>Advisor: <span className='font-normal pl-2'>{apprentice.advisor}</span></li>
                <li className='font-bold'>Registered At: <span className='font-normal pl-2'>{apprenticeDate}</span></li>
                <li className='font-bold'>Induction: <span className='font-normal pl-2'>{apprentice.induction ? 'Completed' : 'Not Completed'}</span></li>
                <li className='font-bold'>Assessment: <span className='font-normal pl-2'>{apprentice.assessment ? 'Completed' : 'Not Completed'}</span></li>
            </ul>
      </DialogContent>
    </Dialog>
  )
}
