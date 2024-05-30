import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState
} from '@tanstack/react-table'

import { Input } from '@/components/ui/input'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import { ReactNode, useState } from 'react'
import { DataTablePagination } from './DataTablePagination'
import { Spinner } from '../../spinner/Spinner'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[] | [],
  children: ReactNode
  isPending: boolean
}

export function DataTable<TData, TValue> ({
  children,
  columns,
  data,
  isPending
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters
    }
  })

  return (
    <div>
      <div className="flex justify-between items-center py-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div>
          {children}
        </div>

      </div>
      <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
          <TableBody>
            {isPending
              ? <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center w-full">
                  <span className='flex items-center justify-center w-full'>
              <Spinner className='text-black'/>Loading...
              </span>
            </TableCell>
              </TableRow>
              : table.getRowModel().rows?.length
                ? (
                    table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
                    ))
                  )
                : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>)}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
      {/* <Pagination>
        <PaginationContent>
        <PaginationItem>
              <Button
              variant="ghost"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
             <ChevronLeft size={16}/> Previous
            </Button>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
              <Button
              variant="ghost"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next <ChevronRight size={16}/>
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination> */}
          <DataTablePagination table={table} />
      </div>
    </div>
    </div>

  )
}
