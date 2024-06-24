import { ApprenticeModel } from '@/schemas/types/ApprenticeModel'
import { DateRangeInputs } from '../apprentice/useFetchApprentices'
import ExcelJS, { Workbook, TableColumnProperties } from 'exceljs'
// import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import { toast } from 'sonner'

type ApprenticeTableModel = Map<keyof Omit <ApprenticeModel, 'accountId' |'role'>, string>

export const useDownloadApprenticesInformation = (data: ApprenticeModel[], dateRange: DateRangeInputs) => {
  const mapApprenticeData = (data: ApprenticeModel[]): ApprenticeTableModel[] => {
    return data.map((apprentice) => {
      const apprenticeMapper = new Map()
      apprenticeMapper.set('name', apprentice.name)
      apprenticeMapper.set('email', apprentice.email)
      apprenticeMapper.set('createdAt', mapDate(apprentice.createdAt))
      apprenticeMapper.set('trade', apprentice.trade)
      apprenticeMapper.set('advisor', apprentice.advisor)
      apprenticeMapper.set('induction', apprentice.induction ? 'COMPLETED' : 'NOT COMPLETED')
      apprenticeMapper.set('assessment', apprentice.assessment ? 'COMPLETED' : 'NOT COMPLETED')
      apprenticeMapper.set('updatedAt', apprentice.updatedAt ? mapDate(apprentice?.updatedAt) : '-')
      return apprenticeMapper
    })
  }

  const mapDate = (date: Date): string => {
    if (!date) return '-'
    const d = new Date(date)
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
  }

  const mappedData = mapApprenticeData(data)

  async function exportExcel () {
    const workbook = new ExcelJS.Workbook()
    createApprenticesWorksheet(workbook)
    createInductionStatusWorksheet(workbook)
    createAssessmentStatusWorksheet(workbook)
    try {
      const buffer = await workbook.xlsx.writeBuffer()
      return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    } catch (error) {
      console.log(error)
    }
  }

  const createApprenticesWorksheet = (workbook: Workbook) => {
    const worksheet = workbook.addWorksheet('Apprentices')
    worksheet.views = [
      {
        state: 'frozen',
        xSplit: 0,
        ySplit: 1
      }
    ]

    const tableCols: TableColumnProperties[] = [
      { name: 'Name', totalsRowLabel: 'Totals:' },
      { name: 'Email' },
      { name: 'CreatedAt' },
      { name: 'Trade' },
      { name: 'Advisor' },
      { name: 'Induction' },
      { name: 'Assessment' },
      { name: 'UpdatedAt' }
    ]

    worksheet.addTable({
      name: 'Apprentices',
      ref: 'A1',
      headerRow: true,
      totalsRow: true,
      style: {
        theme: 'TableStyleMedium10',
        showRowStripes: true
      },
      columns: tableCols,
      rows: mappedData.map(apprentice => {
        return [
          apprentice.get('name'),
          apprentice.get('email'),
          apprentice.get('createdAt'),
          apprentice.get('trade'),
          apprentice.get('advisor'),
          apprentice.get('induction'),
          apprentice.get('assessment'),
          apprentice.get('updatedAt')
        ]
      })
    })
    tableCols.forEach((_, index) => {
      const col = worksheet.columns[index]
      if (col.number === 2) {
        col.width = 30
      } else {
        col.width = 20
      }
    })
  }

  const createInductionStatusWorksheet = (workbook: Workbook) => {
    const worksheet = workbook.addWorksheet('Induction-Status')
    worksheet.views = [
      {
        state: 'frozen',
        xSplit: 0,
        ySplit: 1
      }
    ]

    const tableCols = [
      { name: 'Induction Status' },
      { name: 'Total' }
    ]

    const inductionTask = countApprenticeTasksStatus()

    worksheet.addTable({
      name: 'Induction',
      ref: 'A1',
      headerRow: true,
      totalsRow: true,
      style: {
        theme: 'TableStyleMedium9',
        showRowStripes: true
      },
      columns: tableCols,
      rows: [
        ['COMPLETED', inductionTask.induction.completedTotal],
        ['NOT COMPLETED', inductionTask.induction.notCompletedTotal]
      ]
    })

    tableCols.forEach((_, index) => {
      const col = worksheet.columns[index]
      col.width = 20
    })
  }

  const createAssessmentStatusWorksheet = (workbook: Workbook) => {
    const worksheet = workbook.addWorksheet('Assessment-Status')

    const tableCols = [
      { name: 'Assessment Status' },
      { name: 'Total' }
    ]

    const assessmentTask = countApprenticeTasksStatus()

    worksheet.addTable({
      name: 'Assessment',
      ref: 'A1',
      headerRow: true,
      totalsRow: true,
      style: {
        theme: 'TableStyleMedium9',
        showRowStripes: true
      },
      columns: tableCols,
      rows: [
        ['COMPLETED', assessmentTask.assessment.completedTotal],
        ['NOT COMPLETED', assessmentTask.assessment.notCompletedTotal]
      ]
    })

    tableCols.forEach((_, index) => {
      const col = worksheet.columns[index]
      col.width = 20
    })
  }

  const countApprenticeTasksStatus = () => {
    return mappedData.reduce((count, apprentice) => {
      if (apprentice.get('induction') === 'COMPLETED') count.induction.completedTotal++
      if (apprentice.get('induction') === 'NOT COMPLETED') count.induction.notCompletedTotal++
      if (apprentice.get('assessment') === 'COMPLETED') count.assessment.completedTotal++
      if (apprentice.get('assessment') === 'NOT COMPLETED') count.assessment.notCompletedTotal++
      return count
    }, {
      induction: {
        completedTotal: 0,
        notCompletedTotal: 0
      },
      assessment: {
        completedTotal: 0,
        notCompletedTotal: 0
      }
    })
  }

  const download = async () => {
    try {
      const blob = await exportExcel()
      if (blob && (dateRange?.startDate && dateRange?.endDate)) {
        const startDate = new Date(dateRange?.startDate)
        const endDate = new Date(dateRange?.endDate)
        endDate.setDate(endDate.getDate() - 1)
        const startDateFormatted = `${startDate.getDate()}-${startDate.getMonth() + 1}-${startDate.getFullYear()}`
        const endDateFormatted = `${endDate.getDate()}-${endDate.getMonth() + 1}-${endDate.getFullYear()}`
        const fileName = 'Apprentices ' + startDateFormatted + ' ' + endDateFormatted
        FileSaver.saveAs(blob, `${fileName}.xlsx`)
        toast.success('Apprentices information downloaded successfully')
      }
    } catch (error) {
      console.log(error)
      toast.success('Error while downloading apprentices information')
    }
  }

  return {
    download
  }
}
