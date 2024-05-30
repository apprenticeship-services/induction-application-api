import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ColumnDef } from '@tanstack/react-table'
import { AdminModel } from '@/schemas/admin/adminSchema'

export const columns: ColumnDef<AdminModel>[] = [
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
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => console.log(apprentice)}
            >View apprentice
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
            onClick={() => console.log(apprentice)}
            >Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
