import { Hasher } from '@/data/protocols/cryptography/hasher'
import bcrypt from 'bcrypt'
import env from '@/main/config/env'

export class BcryptAdapter implements Hasher {
  async hash (value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, env.salt)
    return hashedValue
  }
}
