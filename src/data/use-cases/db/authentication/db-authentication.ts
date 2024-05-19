import { Encrypter } from '@/data/protocols/cryptography/encrypter'
import { HashComparer } from '@/data/protocols/cryptography/hash-comparer'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-by-email-repository'
import { UserCredentials } from '@/domain/models/user-credentials'
import { Authentication, AuthenticationParams } from '@/domain/use-cases/authentication'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
  }

  async auth (authCredentials: AuthenticationParams): Promise<UserCredentials> {
    const { email, password } = authCredentials
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (!account) {
      return null
    }

    const isPasswordValid = await this.hashComparer.compare(password, account.password)
    if (!isPasswordValid) {
      return null
    }

    const accessToken = await this.encrypter.encrypt({
      _id: account._id,
      role: account.role
    })

    const userCredentials:UserCredentials = {
      name: account.name,
      email: account.email,
      role: account.role,
      accessToken
    }
    return userCredentials
  }
}
