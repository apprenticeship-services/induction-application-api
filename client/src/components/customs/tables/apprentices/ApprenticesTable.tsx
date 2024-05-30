import useFetchApprentices from '@/hooks/apprentice/useFetchApprentices'
import { DataTable } from '../main/DataTable'
import { columns } from './columns'
import { ApprenticeRegistrationModal } from '../../modals/ApprenticeRegistrationModal'
import { DatePickerWithRange } from '../../date-picker/DateRangePicker'

export const ApprenticesTable = () => {
  const [query, updateDateRange] = useFetchApprentices()

  return (
      <div className="container mx-auto py-10">
          <DatePickerWithRange refetch={updateDateRange} isPending={query.isPending} />
            <DataTable columns={columns} data={query.data ?? [] } isPending={query.isPending} >
                <ApprenticeRegistrationModal/>
            </DataTable>
        </div>
  )
}
