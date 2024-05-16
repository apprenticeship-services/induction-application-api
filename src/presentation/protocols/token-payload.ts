import { JwtPayload } from 'jsonwebtoken'

export type UserJwtPayload = {
    _id: string,
    role:string
} & JwtPayload
