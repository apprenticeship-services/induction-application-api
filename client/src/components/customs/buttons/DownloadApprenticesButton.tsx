import { ApprenticeModel } from '@/schemas/types/ApprenticeModel'
import { Button } from '@/components/ui/button'
import { DateRangeInputs } from '@/hooks/apprentice/useFetchApprentices'
import { Download } from 'lucide-react'
import { useDownloadApprenticesInformation } from '@/hooks/download/useDownloadApprenticesInformation'

type DownloadApprenticesButtonProps = {
    data: ApprenticeModel[],
    dateRange: DateRangeInputs | null
}

export const DownloadApprenticesButton = ({ data, dateRange }: DownloadApprenticesButtonProps) => {
  const { download } = useDownloadApprenticesInformation(data, dateRange!)
  return (
        <Button variant={'outline'} className='gap-1' size={'sm'}
            onClick={download}
            disabled={data?.length === 0}
          >
              <Download size={18}/>
                  Download
              </Button>

  )
}
