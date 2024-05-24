import { Router } from 'express'
import { expressRouteAdapter } from '../adapters/express/express-route-adapter'
import { loginControllerFactory } from '../factories/controller/account/login/login-controller-factory'
import { loginByTokenControllerFactory } from '../factories/controller/account/login-by-token/login-by-token-controller-factory'
import { logoutControllerFactory } from '../factories/controller/account/logout/logout-controller-factory'

export default (router: Router) => {
  router.post('/login', expressRouteAdapter(loginControllerFactory()))
  router.post('/logout', expressRouteAdapter(logoutControllerFactory()))
  router.get('/me', expressRouteAdapter(loginByTokenControllerFactory()))
}
