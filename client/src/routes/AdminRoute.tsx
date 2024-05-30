import { Outlet } from 'react-router'
import { BackOnLastPage } from './BackOnLastPage'
import { useQueryClient } from '@tanstack/react-query'
import { AuthModel } from '@/schemas/types/AccountModel'
import AdminDashboard from '@/pages/dashboard/AdminDashboard'

export const AdminRoute = () => {
  const user = useQueryClient().getQueryData<AuthModel>(['auth'])

  return (
    <>
      {user?.role === 'admin'
        ? (
          <AdminDashboard>
            <Outlet />
          </AdminDashboard>
          )
        : (
        <BackOnLastPage />
          )}
    </>
  )
}

export default AdminRoute
