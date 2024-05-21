import { AccountTokenPayload, Decrypter } from '@/data/protocols/cryptography/decrypter'
import { EncryptDetails, Encrypter } from '@/data/protocols/cryptography/encrypter'
import env from '@/main/config/env'
import jwt from 'jsonwebtoken'
export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {
    this.secret = secret
  }

  async encrypt (details: EncryptDetails): Promise<string> {
    const accessToken = await jwt.sign(details, this.secret)
    return accessToken
  }

  async decrypt (token: string): Promise<AccountTokenPayload> {
    const payload = await jwt.verify(token, this.secret)
    return payload as AccountTokenPayload
  }
}
