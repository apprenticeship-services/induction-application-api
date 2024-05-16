import { JwtPayload as OriginalJwtPayload } from 'jsonwebtoken'

declare module 'jsonwebtoken' {
   interface JwtPayload extends OriginalJwtPayload {
      _id?: string;
      role?:string
  }
}
