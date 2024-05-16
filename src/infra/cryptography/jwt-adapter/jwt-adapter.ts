import { EncryptDetails, Encrypter } from '@/data/protocols/cryptography/encrypter'
import env from '@/main/config/env'
import jwt from 'jsonwebtoken'
export class JwtAdapter implements Encrypter {
  constructor (private readonly secret: string) {
    this.secret = secret
  }

  async encrypt (details: EncryptDetails): Promise<string> {
    const accessToken = await jwt.sign(details, this.secret)
    return accessToken
  }
}
