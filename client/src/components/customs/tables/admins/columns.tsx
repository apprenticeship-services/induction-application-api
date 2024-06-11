import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { AdminInformation } from './AdminInformation'
import { DeletionDialog } from '../../modals/DeletionDialog'
import { useQueryClient } from '@tanstack/react-query'
import { AuthModel } from '@/schemas/types/AccountModel'

export const columns = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'role',
    header: 'Role'
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
    id: 'actions',
    cell: ({ row }) => {
      const queryClient = useQueryClient()
      const auth = queryClient.getQueryData(['auth']) as AuthModel
      const admin = row.original
      return auth?.email !== admin?.email && (
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
            <AdminInformation admin={admin} />
            <DeletionDialog accountId={admin.accountId} role='admin'/>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
