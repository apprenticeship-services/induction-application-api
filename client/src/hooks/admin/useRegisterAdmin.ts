import {
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import axios from '@/api/axios/axios'

const registerAdmin = async (adminData: {name:string, email:string}): Promise<void> => {
  await axios.post('/api/admins',
    adminData
  )
}

export const useRegisterAdmin = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: registerAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
    }
  })
}
