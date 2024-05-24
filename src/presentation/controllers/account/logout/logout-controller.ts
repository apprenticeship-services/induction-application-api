import { noContent } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LogoutController implements Controller {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    const tokenHeader = {
      token: {
        type: 'clearCookie',
        value: null,
        options: null
      }
    }
    return noContent(tokenHeader)
  }
}
