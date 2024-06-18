import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { DeleteForm } from '@/components/customs/forms/delete/DeleteForm'
import { useState } from 'react'

  type DeletionDialogProps = {
      accountId?: string,
      role:'admin' | 'apprentice'
  }

export function DeletionDialog ({ accountId, role }: DeletionDialogProps) {
  const [open, setOpen] = useState(false)
  return (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Delete
            </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. This will permanently delete and remove this account's
                    data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DeleteForm accountId={accountId} role={role} changeDialogOpen={setOpen} />
        </DialogContent>
      </Dialog>

  )
}
