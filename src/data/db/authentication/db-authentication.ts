import { LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-by-email-repository'
import { UserCredentials } from '@/domain/models/user-credentials'
import { Authentication, AuthenticationParams } from '@/domain/use-cases/authentication'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth (userCredentials: AuthenticationParams): Promise<UserCredentials> {
    const { email } = userCredentials
    const isAccount = this.loadAccountByEmailRepository.loadByEmail(email)

    // check if password matches with ghashed password, else null
    // create jwt token
    // return user, with token
    return null
  }
}
