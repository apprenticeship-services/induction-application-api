import { Router } from 'express'
import { expressRouteAdapter } from '../adapters/express/express-route-adapter'
import { registerApprenticeAccountControllerFactory } from '../factories/controller/account/register-apprentice-account/register-apprentice-account-controller-factory'
import { deleteApprenticeControllerFactory } from '../factories/controller/account/delete-apprentice-account/delete-apprentice-account-controller-factory'
import { updateApprenticeInductionControllerFactory } from '../factories/controller/apprentice/update-apprentice-induction/update-apprentice-induction-controller-factory'
import { apprenticeMiddleware } from '../middlewares/apprentice-middleware'
import { updateApprenticeAssessmentControllerFactory } from '../factories/controller/apprentice/update-apprentice-assessment/update-apprentice-assessment-controller-factory'
import { adminMiddleware } from '../middlewares/admin-middleware'
import { getApprenticesByDateRangeControllerFactory } from '../factories/controller/apprentice/get-apprentices-by-date-range/get-apprentices-by-date-range-controller-factory'

export default (router: Router) => {
  router.post('/apprentices', adminMiddleware, expressRouteAdapter(registerApprenticeAccountControllerFactory()))
  router.get('/apprentices', adminMiddleware, expressRouteAdapter(getApprenticesByDateRangeControllerFactory()))
  router.delete('/apprentices/:id', adminMiddleware, expressRouteAdapter(deleteApprenticeControllerFactory()))
  router.put('/apprentice/induction', apprenticeMiddleware, expressRouteAdapter(updateApprenticeInductionControllerFactory()))
  router.patch('/apprentice/assessment', apprenticeMiddleware, expressRouteAdapter(updateApprenticeAssessmentControllerFactory()))
}
