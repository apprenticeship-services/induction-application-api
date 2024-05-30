import { useReconnect } from '@/hooks/reconnect/useReconnect'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export default function Root () {
  const { data } = useReconnect()
  const navigate = useNavigate()

  useEffect(() => {
    if (data) {
      if (data.role === 'admin') {
        navigate('/apprentices')
      }
      if (data.role === 'apprentice') {
        navigate('/induction')
      }
    }
  }, [data])

  return <Outlet />
}
