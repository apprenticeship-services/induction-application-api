import { useReconnect } from '@/hooks/reconnect/useReconnect'
import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoute = () => {
  const { data: user } = useReconnect()
  return <>{user?.email ? <Outlet /> : <Navigate to={'/'} replace />}</>
}
