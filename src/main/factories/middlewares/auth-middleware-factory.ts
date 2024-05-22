import { DbLoadAccountByToken } from '@/data/use-cases/db/account/db-load-account-by-token'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter'
import { AuthMiddleware } from '@/presentation/middlewares/auth/auth-middleware'
import { Middleware } from '@/presentation/protocols/middleware'
import env from '@/main/config/env'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'

export const makeAuthMiddleware = (role?: string): Middleware => {
  const decrypter = new JwtAdapter(env.jwtSecretToken)
  const loadAccountByIdRepository = new AccountMongoRepository()
  const loadAccountByToken = new DbLoadAccountByToken(decrypter, loadAccountByIdRepository)
  return new AuthMiddleware(loadAccountByToken, role)
}
