import { Router } from 'express'
import { expressRouteAdapter } from '../adapters/express/express-route-adapter'
import { registerApprenticeAccountControllerFactory } from '../factories/controller/account/register-apprentice-account/register-apprentice-account-controller-factory'

export default (router: Router) => {
  router.post('/apprentices', expressRouteAdapter(registerApprenticeAccountControllerFactory()))
}
