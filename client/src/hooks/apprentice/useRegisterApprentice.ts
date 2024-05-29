import { ApprenticeRegistrationModel } from '@/schemas/apprentice/apprenticeSchema'
import {
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import axios from '@/api/axios/axios'

const registerApprentice = async (apprenticeData: ApprenticeRegistrationModel): Promise<void> => {
  await axios.post('/api/apprentices',
    apprenticeData
  )
}

export const useRegisterApprentice = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: registerApprentice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apprentices'] })
    }
  })
}
