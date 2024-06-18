import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import path from 'path'
import { limiter } from '../middlewares/rate-limit'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', limiter, router)
  readdirSync(path.join(__dirname, '../routes')).map(async (file) => {
    if (!file.includes('.test.') && !file.includes('.map')) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}
