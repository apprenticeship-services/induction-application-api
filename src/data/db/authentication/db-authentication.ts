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

  async auth (userCredentials: AuthenticationParams): Promise<UserCredentials> {
    const { email, password } = userCredentials
    const isAccount = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (!isAccount) {
      return null
    }

    const isPasswordValid = await this.hashComparer.compare(password, isAccount.password)
    if (!isPasswordValid) {
      return null
    }

    const accessToken = await this.encrypter.encrypt({
      _id: isAccount._id,
      role: isAccount.role
    })
    // create jwt token
    // return user, with token
  }
}
