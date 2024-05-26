import { LoginController } from '@/presentation/controllers/account/login/login-controller'
import { loginValidatorFactory } from './login-validator-factory'
import { DbAuthentication } from '@/data/use-cases/db/authentication/db-authentication'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter'
import env from '@/main/config/env'
import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository'
import { LogControllerDecorator } from '@/main/decorators/log/log-controller-decorator'
import { Controller } from '@/presentation/protocols'

export const loginControllerFactory = (): Controller => {
  const loadAccountByEmailRepository = new AccountMongoRepository()
  const hashComparer = new BcryptAdapter()
  const encrypter = new JwtAdapter(env.jwtSecretToken)
  const authentication = new DbAuthentication(loadAccountByEmailRepository, hashComparer, encrypter)
  return new LogControllerDecorator(new LoginController(loginValidatorFactory(), authentication), new LogMongoRepository())
}
