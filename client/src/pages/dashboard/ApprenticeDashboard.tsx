import Header from '@/components/customs/header/Header'
import InductionNavigation from '@/components/customs/menus/apprentice-sidebar/InductionNavigation'
import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

type DashboardProps = {
  children?: ReactNode;
};

const ApprenticeDashboard = ({ children }: DashboardProps) => {
  const { pathname } = useLocation()
  const appLocation = pathname.split('/')[1]

  return (
    <div className="flex overflow-hidden">
      <InductionNavigation />
      <div className="w-full h-[100vh]">
        <Header />
        <main
          id={appLocation && appLocation}
          className={'bg-slate-50 py-6 sm:py-14  px-4 sm:px-6 dashboard-page-render overflow-y-auto'}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

export default ApprenticeDashboard
