import { Outlet } from 'react-router'
import { BackOnLastPage } from './BackOnLastPage'
import { useQueryClient } from '@tanstack/react-query'
import { AuthModel } from '@/schemas/types/AccountModel'
import ApprenticeDashboard from '@/pages/dashboard/ApprenticeDashboard'

export const ApprenticeRoute = () => {
  const user = useQueryClient().getQueryData<AuthModel>(['auth'])
  return (
    <>
      {user?.role === 'apprentice'
        ? (
            <ApprenticeDashboard>
              <Outlet />
            </ApprenticeDashboard>
          )
        : (
        <BackOnLastPage />
          )}
    </>
  )
}

export default ApprenticeRoute
