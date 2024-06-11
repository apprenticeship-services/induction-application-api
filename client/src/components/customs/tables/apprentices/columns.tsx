import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ColumnDef } from '@tanstack/react-table'
import { ApprenticeModel } from '@/schemas/types/ApprenticeModel'
import { ApprenticeInformation } from './ApprenticeInformation'
import { DeletionDialog } from '../../modals/DeletionDialog'

export const columns: ColumnDef<ApprenticeModel>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className='pl-0 flex gap-2'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Registered At
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = new Date(row.getValue('createdAt'))
      const dateFormatted = `${value.getDate() < 10 ? '0' + value.getDate() : value.getDate()}-${value.getMonth() + 1}-${value.getFullYear()}`
      return <div>{dateFormatted}</div>
    }
  },
  {
    accessorKey: 'induction',
    header: 'Induction',
    cell: ({ row }) => {
      const value = row.getValue('induction')
      const formatted = value ? 'Completed' : 'In Progress'

      return <div className={value ? 'bg-green-500 p-1 text-white rounded' : 'bg-red-500 p-1 text-white rounded'}>
      {formatted}
      </div>
    }
  },
  {
    accessorKey: 'assessment',
    header: 'Assessment',
    cell: ({ row }) => {
      const value = row.getValue('assessment')
      const formatted = value ? 'Completed' : 'In Progress'

      return <div className={value ? 'bg-green-500 p-1 text-white rounded' : 'bg-red-500 p-1 text-white rounded'}>{formatted}</div>
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const apprentice = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel >Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
              <ApprenticeInformation apprentice={apprentice}/>
            <DeletionDialog accountId={apprentice.accountId} role='apprentice'/>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
