import { RegisterAccountRepository, RegisterAccountRepositoryParams } from '@/data/protocols/db/register-account-repository'
import { DbRegisterAdminAccount } from './db-register-admin-account'
import { AccountModel } from '@/domain/models/account'
import { Generator } from '@/data/protocols/cryptography/generator'
import { Hasher } from '@/data/protocols/cryptography/hasher'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-by-email-repository'

type Sut = {
    sut: DbRegisterAdminAccount,
    registerAccountRepositoryStub: RegisterAccountRepository,
    passwordGeneratorStub: Generator,
    hasherStub: Hasher,
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): Sut => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const passwordGeneratorStub = makePasswordGeneratorStub()
  const hasherStub = makeHasherStub()
  const registerAccountRepositoryStub = makeRegisterAccountRepositoryStub()
  const sut = new DbRegisterAdminAccount(loadAccountByEmailRepositoryStub, passwordGeneratorStub, hasherStub, registerAccountRepositoryStub)
  return {
    sut,
    registerAccountRepositoryStub,
    passwordGeneratorStub,
    hasherStub,
    loadAccountByEmailRepositoryStub
  }
}

const makeRegisterAccountRepositoryStub = (): RegisterAccountRepository => {
  class RegisterAccountRepositoryStub implements RegisterAccountRepository {
    register (credentials: RegisterAccountRepositoryParams): Promise<AccountModel> {
      return Promise.resolve(fakeAccountModel())
    }
  }
  return new RegisterAccountRepositoryStub()
}

const makePasswordGeneratorStub = (): Generator => {
  class PasswordGeneratorStub implements Generator {
    generate (): string {
      return 'any_password'
    }
  }
  return new PasswordGeneratorStub()
}

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return Promise.resolve('hashed_password')
    }
  }
  return new HasherStub()
}

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return null
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const fakeAccountModel = (): AccountModel => ({
  _id: 'any_id',
  name: 'any_name',
  email: 'any_email@hotmail.com',
  role: 'any_role',
  password: 'hashed_password',
  createdAt: new Date()
})

const fakeCredentials = (): RegisterAccountRepositoryParams => ({
  name: 'any_name',
  email: 'any_email@hotmail.com',
  password: 'any_password',
  role: 'admin'
})

describe('DbRegisterAdminAccount', () => {
  test('Should call RegisterAccountRepository with correct values ', async () => {
    const { sut, registerAccountRepositoryStub } = makeSut()
    const repoSpy = jest.spyOn(registerAccountRepositoryStub, 'register')
    await sut.register(fakeCredentials())
    expect(repoSpy).toHaveBeenCalledWith({
      ...fakeCredentials(),
      password: 'hashed_password'
    })
  })

  test('Should call PasswordGenerator', async () => {
    const { sut, passwordGeneratorStub } = makeSut()
    const generatorSpy = jest.spyOn(passwordGeneratorStub, 'generate')
    await sut.register(fakeCredentials())
    expect(generatorSpy).toHaveBeenCalledTimes(1)
  })

  test('Should call Hasher with generated password ', async () => {
    const { sut, hasherStub } = makeSut()
    const hasherSpy = jest.spyOn(hasherStub, 'hash')
    await sut.register(fakeCredentials())
    expect(hasherSpy).toHaveBeenCalledWith('any_password')
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.register(fakeCredentials())
    expect(loadByEmailSpy).toHaveBeenCalledWith(fakeCredentials().email)
  })
})
