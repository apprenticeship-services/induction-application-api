import { Router } from 'express'
import { expressRouteAdapter } from '../adapters/express/express-route-adapter'
import { registerAdminAccountControllerFactory } from '../factories/controller/account/register-admin-account/register-admin-account-controller-factory'
import { deleteAdminControllerFactory } from '../factories/controller/account/delete-admin-account/delete-admin-account-controller-factory'

export default (router: Router) => {
  router.post('/admins', expressRouteAdapter(registerAdminAccountControllerFactory()))
  router.delete('/admins/:id', expressRouteAdapter(deleteAdminControllerFactory()))
}
