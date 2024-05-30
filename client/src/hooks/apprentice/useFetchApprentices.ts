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

const useFetchApprentices = (): [
    UseQueryResult<ApprenticeModel[], Error>,
    (dates: DateRangeInputs) => void
  ] => {
  const [dateRange, setDateRange] = useState<DateRangeInputs | null>({
    startDate: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`,
    endDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate() + 1}`
  })

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
