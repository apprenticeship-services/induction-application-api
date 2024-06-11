import axios from '@/api/axios/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type DeletionData = {
  accountId: string
  role: 'admin' | 'apprentice'
}

const deleteAccount = async ({ accountId, role }: DeletionData) => {
  if (role === 'admin') {
    const response = await axios.delete(`/api/admins/${accountId}`)
    return response.data
  }

  const response = await axios.delete(`/api/apprentices/${accountId}`)
  return response.data
}

export const useDeleteAccount = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apprentices'] })
    }
  })
}
