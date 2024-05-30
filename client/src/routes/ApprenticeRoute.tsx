import { Outlet } from 'react-router'
import { BackOnLastPage } from './BackOnLastPage'
import { useQueryClient } from '@tanstack/react-query'
import { AuthModel } from '@/schemas/types/AccountModel'

export const ApprenticeRoute = () => {
  const user = useQueryClient().getQueryData<AuthModel>(['auth'])

  return (
    <>
      {user?.role === 'apprentice'
        ? (
      // <Dashboard>
          <Outlet />
      // </Dashboard>
          )
        : (
        <BackOnLastPage />
          )}
    </>
  )
}

export default ApprenticeRoute
