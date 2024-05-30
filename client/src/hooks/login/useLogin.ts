import {
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import axios from '@/api/axios/axios'
import { LoginModel } from '@/schemas/login/loginSchema'
import { AuthModel } from '@/schemas/types/AccountModel'

const login = async (loginData: LoginModel): Promise<AuthModel> => {
  const response = await axios.post('/api/login',
    loginData
  )
  return response.data as AuthModel
}

export const useLogin = () => {
  const queryClient = useQueryClient()
  return useMutation<AuthModel, Error, LoginModel>({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth'], data)
    }
  })
}
