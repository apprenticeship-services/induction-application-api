import axios from '@/api/axios/axios'
import { AdminModel } from '@/schemas/types/AdminModel'
import { useQuery } from '@tanstack/react-query'

const fetchAdmins = async () => {
  const response = await axios.get('/api/admins')
  return response.data as AdminModel[]
}

const useFetchAdmins = () => {
  const query = useQuery<AdminModel[], Error>({
    queryKey: ['admins'],
    queryFn: fetchAdmins,
    meta: {
      errorMessage: 'Failed to fetch admins'
    },
    staleTime: Infinity
  })

  return { query }
}

export default useFetchAdmins
