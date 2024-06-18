import express from 'express'
import setRoutes from './routes'
import { setStaticFiles, setStaticFilesRoute } from './static-files'
import setMiddlewares from './middlewares'

const app = express()
setStaticFiles(app)
setMiddlewares(app)
setRoutes(app)
setStaticFilesRoute(app)
export default app
