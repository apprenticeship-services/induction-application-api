import { ApprenticeModel } from '@/schemas/types/ApprenticeModel'
import { Button } from '@/components/ui/button'
import { DateRangeInputs } from '@/hooks/apprentice/useFetchApprentices'
import { Download } from 'lucide-react'
import * as XLSX from 'xlsx'

type DownloadApprenticesButtonProps = {
    data: ApprenticeModel[],
    dateRange: DateRangeInputs | null
}

export const DownloadApprenticesButton = ({ data, dateRange }: DownloadApprenticesButtonProps) => {
  const mapApprenticeData = (data: ApprenticeModel[]) => {
    return data.map((apprentice) => {
      const mapped = {
        ...apprentice,
        induction: apprentice.induction ? 'COMPLETED' : 'NOT COMPLETED',
        assessment: apprentice.assessment ? 'COMPLETED' : 'NOT COMPLETED',
        updatedAt: apprentice.updatedAt || '-'
      }
      delete mapped?.accountId
      return mapped
    })
  }

  const handleDownload = async () => {
    const mappedData = mapApprenticeData(data)
    const fileName = 'Apprentices-' + dateRange?.startDate + ' ' + dateRange?.endDate
    const fileExtension = '.xlsx'
    const worksheet = XLSX.utils.json_to_sheet(mappedData || [])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, fileName)
    XLSX.writeFile(workbook, fileName + fileExtension)
  }
  return (
        <Button variant={'outline'} className='gap-1' size={'sm'}
            onClick={handleDownload}
            disabled={data?.length === 0}
          >
              <Download size={18}/>
                  Download
              </Button>

  )
}
