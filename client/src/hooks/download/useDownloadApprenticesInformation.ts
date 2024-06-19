import { ApprenticeModel } from '@/schemas/types/ApprenticeModel'
import { DateRangeInputs } from '../apprentice/useFetchApprentices'
import * as XLSX from 'xlsx'

export const useDownloadApprenticesInformation = (data: ApprenticeModel[], dateRange:DateRangeInputs) => {
  const mapApprenticeData = (data: ApprenticeModel[]) => {
    return data.map((apprentice) => {
      const mapped = {
        ...apprentice,
        createdAt: mapDate(apprentice.createdAt),
        induction: apprentice.induction ? 'COMPLETED' : 'NOT COMPLETED',
        assessment: apprentice.assessment ? 'COMPLETED' : 'NOT COMPLETED',
        updatedAt: apprentice.updatedAt ? mapDate(apprentice?.updatedAt) : '-'
      }
      delete mapped?.accountId
      return mapped
    })
  }

  const mapDate = (date: Date): string => {
    if (!date) return '-'
    const d = new Date(date)
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
  }

  const download = async () => {
    const mappedData = mapApprenticeData(data)
    if (dateRange?.startDate && dateRange?.endDate) {
      const startDate = new Date(dateRange?.startDate)
      const endDate = new Date(dateRange?.endDate)
      endDate.setDate(endDate.getDate() - 1)
      const startDateFormatted = `${startDate.getDate()}-${startDate.getMonth() + 1}-${startDate.getFullYear()}`
      const endDateFormatted = `${endDate.getDate()}-${endDate.getMonth() + 1}-${endDate.getFullYear()}`
      const fileName = 'Apprentices-' + startDateFormatted + ' ' + endDateFormatted
      const fileExtension = '.xlsx'
      const worksheet = XLSX.utils.json_to_sheet(mappedData || [])
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, fileName)
      XLSX.writeFile(workbook, fileName + fileExtension)
    }
  }

  return {
    download
  }
}
