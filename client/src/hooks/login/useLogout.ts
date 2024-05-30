import {
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import axios from '@/api/axios/axios'

const logout = async () => {
  await axios.post('/api/logout')
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error>({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries()
    }
  })
}
