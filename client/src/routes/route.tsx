import { RouteObject, createBrowserRouter } from 'react-router-dom'
import Root from './Root'
import { Login } from '@/pages/login/Login'
import { ProtectedRoute } from './ProtectedRoute'
import { AdminRoute } from './AdminRoute'
import { ApprenticeRoute } from './ApprenticeRoute'
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
            element: <div>apprentices table</div>
          }

        ]
        //   {
        //     path: 'admins',
        //     // loader: adminsLoader,
        //     element: <Admins />
        //   },
        //   {
        // ]
      },
      {
        path: '',
        element: <ApprenticeRoute />,
        children: [
          {
            path: 'induction',
            // loader: apprenticesLoader,
            element: <div>induction</div>
          }

        ]
        // children: [
        //   {
        //     path: 'induction',
        //     element: <Induction />,
        //     children: [
        //       {
        //         path: '',
        //         element: <Introduction />
        //       },
        //       {
        //         path: 'assessment',
        //         element: <Assessment />
        //       }
        //     ]
        //   }
        // ]
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
