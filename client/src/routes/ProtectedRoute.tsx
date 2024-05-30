import { AuthModel } from '@/schemas/types/AccountModel'
import { useQueryClient } from '@tanstack/react-query'
import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoute = () => {
  const user = useQueryClient().getQueryData<AuthModel>(['auth'])
  return <>{user?.email ? <Outlet /> : <Navigate to={'/'} replace />}</>
}
