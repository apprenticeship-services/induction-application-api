import useFetchApprentices from '@/hooks/apprentice/useFetchApprentices'
import { DataTable } from '../main/DataTable'
import { columns } from './columns'
import { ApprenticeRegistrationModal } from '../../modals/ApprenticeRegistrationModal'
import { DatePickerWithRange } from '../../date-picker/DateRangePicker'
import { DownloadApprenticesButton } from '../../buttons/DownloadApprenticesButton'

export const ApprenticesTable = () => {
  const [query, updateDateRange, dateRange] = useFetchApprentices()

  return (
      <div className="container mx-auto py-10">
          <DatePickerWithRange refetch={updateDateRange} isPending={query.isPending} />
          <DataTable columns={columns} data={query.data ?? []} isPending={query.isPending} >
            <div className='flex justify-center gap-4'>
          <DownloadApprenticesButton data={query?.data ?? []} dateRange={dateRange} />
                <ApprenticeRegistrationModal/>
            </div>
          </DataTable>
      </div>
  )
}
