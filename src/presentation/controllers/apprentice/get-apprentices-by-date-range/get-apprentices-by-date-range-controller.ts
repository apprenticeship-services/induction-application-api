import { LoadApprenticesByDateRange } from '@/domain/use-cases/load-apprentices-by-date-range'
import { badRequest, serverError, success } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { Validator } from '@/presentation/protocols/validator'

export class GetApprenticesByDateRangeController implements Controller {
  constructor (
        private readonly validator: Validator,
    private readonly loadApprenticesByDateRange: LoadApprenticesByDateRange) {
    this.validator = validator
    this.loadApprenticesByDateRange = loadApprenticesByDateRange
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(request.query)
      if (error) {
        return badRequest(error)
      }
      const { startDate, endDate } = request.query
      const apprentices = await this.loadApprenticesByDateRange.loadByDateRange(startDate, endDate)
      return success(apprentices)
    } catch (error) {
      return serverError(error)
    }
  }
}
