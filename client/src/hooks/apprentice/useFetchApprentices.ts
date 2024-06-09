import axios from '@/api/axios/axios'
import { ApprenticeModel } from '@/schemas/types/ApprenticeModel'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export type DateRangeInputs = {
    startDate: string | undefined,
    endDate: string | undefined
}

const fetchApprentices = async (dates: DateRangeInputs) => {
  if (!dates.startDate || !dates.endDate) throw new Error('Date range is not set')
  const response = await axios.get('/api/apprentices', {
    params: {
      ...dates
    }
  })
  return response.data as ApprenticeModel[]
}

const refreshDate = () => {
  const start = new Date()
  const end = new Date(start)
  end.setDate(start.getMonth() + 1)
  return {
    startDate: `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}`,
    endDate: `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate() + 1}`
  }
}

const useFetchApprentices = (): [
    UseQueryResult<ApprenticeModel[], Error>,
    (dates: DateRangeInputs) => void
  ] => {
  const [dateRange, setDateRange] = useState<DateRangeInputs | null>(refreshDate())
  console.log(dateRange)

  const query = useQuery<ApprenticeModel[], Error>({
    queryKey: ['apprentices', dateRange],
    queryFn: () => {
      if (!dateRange || dateRange.startDate === undefined || !dateRange.endDate === undefined) throw new Error('Date range is not set')
      return fetchApprentices(dateRange)
    },
    meta: {
      errorMessage: 'Failed to fetch apprentices'
    },
    staleTime: Infinity
  })

  const updateDateRange = (dates: DateRangeInputs) => {
    console.log(dates)
    setDateRange(dates)
  }

  return [query, updateDateRange]
}

export default useFetchApprentices
