import { DbLoadAccountByToken } from '@/data/use-cases/db/account/db-load-account-by-token'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository'
import env from '@/main/config/env'
import { LogControllerDecorator } from '@/main/decorators/log/log-controller-decorator'
import { LoginByTokenController } from '@/presentation/controllers/account/login/login-by-token-controller'
import { Controller } from '@/presentation/protocols'

export const loginByTokenControllerFactory = (): Controller => {
  const decrypter = new JwtAdapter(env.jwtSecretToken)
  const loadAccountByIdRepository = new AccountMongoRepository()
  const loadAccountByToken = new DbLoadAccountByToken(decrypter, loadAccountByIdRepository)
  return new LogControllerDecorator(new LoginByTokenController(loadAccountByToken), new LogMongoRepository())
}
