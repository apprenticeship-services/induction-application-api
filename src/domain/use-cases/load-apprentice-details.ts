import { ApprenticeDetailsModel } from '../models/apprentice-details'

export interface LoadApprenticeDetails {
    loadApprenticeDetails(accountId: string): Promise<ApprenticeDetailsModel>
}
