import { Router } from 'express'
import { expressRouteAdapter } from '../adapters/express/express-route-adapter'
import { loginControllerFactory } from '../factories/controller/account/login/login-controller-factory'

export default (router: Router) => {
  router.post('/login', expressRouteAdapter(loginControllerFactory()))
}
