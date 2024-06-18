import { Router } from 'express'
import { expressRouteAdapter } from '../adapters/express/express-route-adapter'
import { registerApprenticeAccountControllerFactory } from '../factories/controller/account/register-apprentice-account/register-apprentice-account-controller-factory'
import { deleteApprenticeControllerFactory } from '../factories/controller/account/delete-apprentice-account/delete-apprentice-account-controller-factory'
import { updateApprenticeInductionControllerFactory } from '../factories/controller/apprentice/update-apprentice-induction/update-apprentice-induction-controller-factory'
import { apprenticeMiddleware } from '../middlewares/apprentice-middleware'
import { updateApprenticeAssessmentControllerFactory } from '../factories/controller/apprentice/update-apprentice-assessment/update-apprentice-assessment-controller-factory'
import { adminMiddleware } from '../middlewares/admin-middleware'
import { getApprenticesByDateRangeControllerFactory } from '../factories/controller/apprentice/get-apprentices-by-date-range/get-apprentices-by-date-range-controller-factory'
import jwt from 'jsonwebtoken'
import env from '../config/env'
import { UserJwtPayload } from '@/presentation/protocols/token-payload'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export default (router: Router) => {
  router.post('/apprentices', adminMiddleware, expressRouteAdapter(registerApprenticeAccountControllerFactory()))
  router.get('/apprentices', adminMiddleware, expressRouteAdapter(getApprenticesByDateRangeControllerFactory()))
  router.get('/apprentice', apprenticeMiddleware, async (req, res) => {
    const token = req.cookies?.token
    const decodedToken = jwt.verify(token, env.jwtSecretToken) as UserJwtPayload
    if (!decodedToken._id) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    type Apprentice = {
      accountId: string,
      induction: boolean,
      assessment: boolean
    }
    const apprenticeInfo = await (await MongoHelper.getCollection('apprentices')).findOne<Apprentice>({ accountId: new ObjectId(decodedToken._id) })
    return res.status(200).json(apprenticeInfo)
  })
  router.delete('/apprentices/:id', adminMiddleware, expressRouteAdapter(deleteApprenticeControllerFactory()))
  router.put('/apprentice/induction', apprenticeMiddleware, expressRouteAdapter(updateApprenticeInductionControllerFactory()))
  router.patch('/apprentice/assessment', apprenticeMiddleware, expressRouteAdapter(updateApprenticeAssessmentControllerFactory()))
}
