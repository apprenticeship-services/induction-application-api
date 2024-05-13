import express from 'express'
import setRoutes from './routes'
import setMiddlewares from './middlewares'

const app = express()
setMiddlewares(app)
setRoutes(app)
export default app
