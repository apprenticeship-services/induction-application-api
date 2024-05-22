import { Router } from 'express'
import { expressRouteAdapter } from '../adapters/express/express-route-adapter'
import { registerApprenticeAccountControllerFactory } from '../factories/controller/account/register-apprentice-account/register-apprentice-account-controller-factory'
import { deleteApprenticeControllerFactory } from '../factories/controller/account/delete-apprentice-account/delete-apprentice-account-controller-factory'
import { updateApprenticeInductionControllerFactory } from '../factories/controller/apprentice-induction/update-apprentice-induction/update-apprentice-induction-controller-factory'
import { apprenticeMiddleware } from '../middlewares/apprentice-middleware'

export default (router: Router) => {
  router.post('/apprentices', expressRouteAdapter(registerApprenticeAccountControllerFactory()))
  router.delete('/apprentices/:id', expressRouteAdapter(deleteApprenticeControllerFactory()))
  router.put('/apprentice/induction', apprenticeMiddleware, expressRouteAdapter(updateApprenticeInductionControllerFactory()))
}
