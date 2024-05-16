import { LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'
import { AccountModel } from '@/domain/models/account'
import { AuthenticationParams } from '@/domain/use-cases/authentication'
import { HashComparer } from '@/data/protocols/cryptography/hash-comparer'

type Sut = {
    sut: DbAuthentication,
  loadAccountByEmailRepoStub: LoadAccountByEmailRepository,
    hashComparerStub: HashComparer
}

const makeSut = (): Sut => {
  const hashComparerStub = makeHashComparerStub()
  const loadAccountByEmailRepoStub = makeLoadAccountByEmailRepo()
  const sut = new DbAuthentication(loadAccountByEmailRepoStub, hashComparerStub)
  return {
    sut,
    loadAccountByEmailRepoStub,
    hashComparerStub
  }
}

const makeLoadAccountByEmailRepo = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return Promise.resolve(fakeAccountModel())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (hash: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new HashComparerStub()
}

const fakeAccountModel = (): AccountModel => ({
  _id: 'any_id',
  name: 'any_name',
  email: 'any_email@hotmail.com',
  role: 'any_role',
  password: 'hashed_password',
  createdAt: new Date()
})

const fakeCredentials = (): AuthenticationParams => ({
  email: 'any_email@hotmail.com',
  password: 'any_password'
})
describe('Db Authentication Use-case', () => {
  test('Should call LoadByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepoStub } = makeSut()
    const loadAccountSpy = jest.spyOn(loadAccountByEmailRepoStub, 'loadByEmail')
    await sut.auth(fakeCredentials())
    expect(loadAccountSpy).toHaveBeenCalledWith(fakeCredentials().email)
  })

  test('Should return null if email is not found by LoadAccountByEmailRepository', async () => {
    const { sut, loadAccountByEmailRepoStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepoStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(null))
    const authResponse = await sut.auth(fakeCredentials())
    expect(authResponse).toBeNull()
  })

  test('Should call HashComparer with correct password and password to compare', async () => {
    const { sut, hashComparerStub } = makeSut()
    const hashComparerSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(fakeCredentials())
    expect(hashComparerSpy).toHaveBeenCalledWith(fakeCredentials().password, fakeAccountModel().password)
  })
})
