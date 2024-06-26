import { LogErrorRepository } from '@/data/protocols/db/log-error-repository'
import { ServerError } from '@/presentation/errors/server-error'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LogControllerDecorator implements Controller {
  constructor (private readonly controller: Controller, private readonly logErrorRepository: LogErrorRepository) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const response = await this.controller.handle(httpRequest)
    if (response.statusCode === 500) {
      const error = response.body as ServerError
      this.logErrorRepository.logError(error.stack)
    }
    return response
  }
}
