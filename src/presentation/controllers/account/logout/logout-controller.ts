import env from '@/main/config/env'
import { noContent } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LogoutController implements Controller {
  async handle (request: HttpRequest): Promise<HttpResponse> {
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
    return noContent(tokenHeader)
  }
}
