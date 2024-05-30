import { DataTable } from '../main/DataTable'
import { columns } from './columns'
import { AdminRegistrationModal } from '../../modals/AdminRegistrationModal'
import useFetchAdmins from '@/hooks/admin/useFetchApprentices'

export const AdminsTable = () => {
  const { query } = useFetchAdmins()

  return (
      <div className="container mx-auto py-10">
            <DataTable columns={columns} data={query.data ?? [] } isPending={query.isPending} >
                <AdminRegistrationModal/>
            </DataTable>
        </div>
  )
}
