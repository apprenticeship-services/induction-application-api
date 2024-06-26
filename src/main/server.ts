import 'module-alias/register'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'

MongoHelper.connect(env.mongoUri)
  .then(async () => {
    const app = (await import('@/main/config/app')).default
    app.listen(env.port, () => { console.log(`Server running at http://localhost:${env.port}`) })
  })
