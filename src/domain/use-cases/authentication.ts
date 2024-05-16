import { UserCredentials } from '../models/user-credentials'

export type AuthenticationParams = {
    email: string,
    password: string,
}

export interface Authentication {
    auth(userCredentials: AuthenticationParams):Promise<UserCredentials>
}
