import { Middleware } from '@/presentation/protocols/middleware'
import { forbidden, serverError, success } from '@/presentation/helpers/http-helper'
import { AccessDeniedError } from '@/presentation/errors/access-denied-error'
import { HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LoadAccountByToken } from '@/domain/use-cases/load-account-by-token'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role: string
  ) {
    this.loadAccountByToken = loadAccountByToken
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const token = httpRequest.cookies?.token
      if (!token) {
        return forbidden(new AccessDeniedError())
      }

      const account = await this.loadAccountByToken.loadByToken(token, this.role)
      if (!account) {
        return forbidden(new AccessDeniedError())
      }
      return success({ accountId: account._id })
    } catch (error) {
      return serverError(error)
    }
  }
}
