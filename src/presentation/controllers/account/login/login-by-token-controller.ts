import { Middleware } from '@/presentation/protocols/middleware'
import { forbidden, noContent, serverError, success } from '@/presentation/helpers/http-helper'
import { AccessDeniedError } from '@/presentation/errors/access-denied-error'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LoadAccountByToken } from '@/domain/use-cases/load-account-by-token'
import env from '@/main/config/env'

export class LoginByTokenController implements Controller {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) {
    this.loadAccountByToken = loadAccountByToken
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const token = httpRequest.reconnectToken
      if (!token) {
        return noContent()
      }

      const account = await this.loadAccountByToken.loadByToken(token, 'reconnect')
      if (!account) {
        const tokenHeader = {
          token: {
            type: 'clearCookie',
            value: null,
            options: {
              httpOnly: true,
              secure: true,
              sameSite: env.nodeEnvironment === 'development' ? 'none' : 'strict'
            }
          }
        }
        return forbidden(new AccessDeniedError(), tokenHeader)
      }

      const { name, email, role } = account
      return success({
        name,
        email,
        role
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
