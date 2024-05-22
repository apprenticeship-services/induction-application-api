import { expressMiddlewareAdapter } from '../adapters/express/express-middleware-adapter'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export const adminMiddleware = expressMiddlewareAdapter(makeAuthMiddleware('admin'))
