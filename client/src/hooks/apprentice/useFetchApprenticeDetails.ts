import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import axios from '@/api/axios/axios'
import { toast } from 'sonner'
import { UserAnswer } from '@/components/customs/questionnaire/types/UserAnswer'

const fetchApprenticeDetails = async () => {
  const { data } = await axios.get('/api/apprentice')
  return data
}

const completeInduction = async () => {
  await axios.put('/api/apprentice/induction')
}

const completeAssessment = async (answers: UserAnswer) => {
  await axios.patch('/api/apprentice/assessment', {
    answers: {
      ...answers
    }
  })
}

const useFetchApprenticeDetails = () => {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['apprenticeDetails'],
    queryFn: fetchApprenticeDetails,
    staleTime: Infinity
  })

  const mutationInduction = useMutation<void, Error>({
    mutationFn: completeInduction,
    onSuccess: () => {
      toast.success('You completed your induction!')
      queryClient.invalidateQueries({ queryKey: ['apprenticeDetails'] })
    },
    onError: () => {
      toast.success('Error while completing induction!')
    }
  })

  const mutationAssessment = useMutation({
    mutationFn: completeAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apprenticeDetails'] })
    }
  })

  useEffect(() => {
    if (query.error) {
      toast.error('Failed to fetch apprentice details')
    }
  }, [query.error])
  return {
    query,
    mutationInduction,
    mutationAssessment
  }
}

export default useFetchApprenticeDetails
