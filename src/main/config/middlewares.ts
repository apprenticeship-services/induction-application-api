import { Express } from 'express'
import { bodyParser, cors, contentType } from '@/main/middlewares'
import cookieParser from 'cookie-parser'
export default (app: Express): void => {
  app.use(cookieParser())
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
}
