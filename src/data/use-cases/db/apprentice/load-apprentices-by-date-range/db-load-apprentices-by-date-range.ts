import { LoadApprenticesByDateRangeRepository } from '@/data/protocols/db/load-apprentices-by-date-range-repository'
import { ApprenticeInformationModel, LoadApprenticesByDateRange } from '@/domain/use-cases/load-apprentices-by-date-range'

export class DbLoadApprenticeByDateRange implements LoadApprenticesByDateRange {
  constructor (private readonly loadApprenticesByDateRangeRepository: LoadApprenticesByDateRangeRepository) {
    this.loadApprenticesByDateRangeRepository = loadApprenticesByDateRangeRepository
  }

  async loadByDateRange (startDate: Date, endDate: Date): Promise<ApprenticeInformationModel[]> {
    return await this.loadApprenticesByDateRangeRepository.loadByDateRange(startDate, endDate)
  }
}
