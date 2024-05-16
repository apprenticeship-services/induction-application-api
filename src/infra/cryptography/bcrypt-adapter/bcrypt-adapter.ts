import { Hasher } from '@/data/protocols/cryptography/hasher'
import bcrypt from 'bcrypt'
import env from '@/main/config/env'
import { HashComparer } from '@/data/protocols/cryptography/hash-comparer'

export class BcryptAdapter implements Hasher, HashComparer {
  async hash (value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, env.salt)
    return hashedValue
  }

  async compare (password: string, hashedPassword: string): Promise<boolean> {
    const isValid = await bcrypt.compare(password, hashedPassword)
    return isValid
  }
}
