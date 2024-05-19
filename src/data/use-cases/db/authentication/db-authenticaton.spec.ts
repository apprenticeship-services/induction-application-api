import { LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'
import { AccountModel } from '@/domain/models/account'
import { AuthenticationParams } from '@/domain/use-cases/authentication'
import { HashComparer } from '@/data/protocols/cryptography/hash-comparer'
import { EncryptDetails, Encrypter } from '@/data/protocols/cryptography/encrypter'

type Sut = {
    sut: DbAuthentication,
    loadAccountByEmailRepoStub: LoadAccountByEmailRepository,
    hashComparerStub: HashComparer,
    encrypterStub: Encrypter
}

const makeSut = (): Sut => {
  const loadAccountByEmailRepoStub = makeLoadAccountByEmailRepo()
  const hashComparerStub = makeHashComparerStub()
  const encrypterStub = makeEncrypterStub()
  const sut = new DbAuthentication(loadAccountByEmailRepoStub, hashComparerStub, encrypterStub)
  return {
    sut,
    loadAccountByEmailRepoStub,
    hashComparerStub,
    encrypterStub
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

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (details: EncryptDetails): Promise<string> {
      return Promise.resolve(fakeToken())
    }
  }
  return new EncrypterStub()
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

const fakeToken = (): string => 'any_token'

const fakeEncryptDetails = (): EncryptDetails => ({
  _id: 'any_id',
  role: 'any_role'
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

  test('Should throw if LoadAccountByEmailRepository fails', async () => {
    const { sut, loadAccountByEmailRepoStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepoStub, 'loadByEmail').mockReturnValueOnce(Promise.reject(new Error()))
    const authResponse = sut.auth(fakeCredentials())
    expect(authResponse).rejects.toThrow()
  })

  test('Should call HashComparer with correct password and password to compare', async () => {
    const { sut, hashComparerStub } = makeSut()
    const hashComparerSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(fakeCredentials())
    expect(hashComparerSpy).toHaveBeenCalledWith(fakeCredentials().password, fakeAccountModel().password)
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(null))
    const authResponse = await sut.auth(fakeCredentials())
    expect(authResponse).toBeNull()
  })

  test('Should throw if HashComparer fails', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.reject(new Error()))
    const authResponse = sut.auth(fakeCredentials())
    expect(authResponse).rejects.toThrow()
  })

  test('Should call Encrypter with correct values', async () => {
    const { sut, encrypterStub } = makeSut()
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(fakeCredentials())
    expect(encrypterSpy).toHaveBeenCalledWith(fakeEncryptDetails())
  })

  test('Should throw if Encrypter fails', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))
    const authResponse = sut.auth(fakeCredentials())
    expect(authResponse).rejects.toThrow()
  })

  test('Should return user credentials on success', async () => {
    const { sut } = makeSut()
    const authResponse = await sut.auth(fakeCredentials())
    expect(authResponse).toEqual({
      name: fakeAccountModel().name,
      email: fakeAccountModel().email,
      role: fakeAccountModel().role,
      accessToken: fakeToken()
    })
  })
})
