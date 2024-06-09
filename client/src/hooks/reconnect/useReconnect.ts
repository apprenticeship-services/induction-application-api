import {
  useQuery
} from '@tanstack/react-query'
import axios from '@/api/axios/axios'
import { AuthModel } from '@/schemas/types/AccountModel'

const reconnect = async (): Promise<AuthModel> => {
  const response = await axios.get('/api/me')
  return response.data as AuthModel
}

export const useReconnect = () => {
  return useQuery<AuthModel, Error>({
    queryKey: ['auth'],
    queryFn: reconnect,
    staleTime: Infinity
  })
}
