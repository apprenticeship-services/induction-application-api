import { RouteObject, createBrowserRouter } from 'react-router-dom'
import Root from './Root'
import { Login } from '@/pages/login/Login'
import { ProtectedRoute } from './ProtectedRoute'
import { AdminRoute } from './AdminRoute'
import { ApprenticeRoute } from './ApprenticeRoute'
import Apprentices from './Apprentices'
import Admins from './Admins'
import { Induction } from '@/pages/apprentices/Induction'
import { Assessment } from '@/pages/apprentices/Assessment'
// TODO: Redirect user to Dashboard if logged in already

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Login />
      }

    ]
  },
  {
    element: <ProtectedRoute/>,
    children: [
      {
        path: '',
        element: <AdminRoute/>,
        children: [
          {
            path: 'apprentices',
            // loader: apprenticesLoader,
            element: <Apprentices />
          },
          {
            path: 'admins',
            // loader: adminsLoader,
            element: <Admins/>
          }
        ]
      },
      {
        path: '',
        element: <ApprenticeRoute />,
        children: [
          {
            path: 'induction',
            element: <Induction/>
          },
          {
            path: 'assessment',
            element: <Assessment/>
          }

        ]
      }
    ]
  },
  {
    path: '*',
    element: <h1>Error page</h1>
  }
]

const router = createBrowserRouter(routes)

export default router
