import { UserCredentials } from '../models/user-credentials'

export type AuthenticationParams = Omit<UserCredentials, 'accessToken'>

export interface Authentication {
    auth(userCredentials: AuthenticationParams):Promise<UserCredentials>
}
