import { ApprenticeModel } from '@/domain/models/apprentice-model'

export type ApprenticeInformationParams = Omit<ApprenticeModel, '_id'>

export interface RegisterApprenticeInformationRepository {
    register(apprenticeInformation:ApprenticeInformationParams, configOps?:object):Promise<void>
}
