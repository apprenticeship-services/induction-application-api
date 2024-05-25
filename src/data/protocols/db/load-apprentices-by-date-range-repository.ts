import { ApprenticeInformationModel } from '@/domain/use-cases/load-apprentices-by-date-range'

export interface LoadApprenticesByDateRangeRepository{
    loadByDateRange(startDate: Date, endDate: Date):Promise<ApprenticeInformationModel[]>
}
