import { RegisterAccountRepository, RegisterAccountRepositoryParams } from '@/data/protocols/db/register-account-repository'
import { DbRegisterAdminAccount } from './db-register-admin-account'
import { AccountModel } from '@/domain/models/account'
import { Generator } from '@/data/protocols/cryptography/generator'

type Sut = {
    sut: DbRegisterAdminAccount,
    registerAccountRepositoryStub: RegisterAccountRepository,
    passwordGeneratorStub: Generator
}

const makeSut = (): Sut => {
  const registerAccountRepositoryStub = makeRegisterAccountRepositoryStub()
  const passwordGeneratorStub = makePasswordGeneratorStub()
  const sut = new DbRegisterAdminAccount(registerAccountRepositoryStub, passwordGeneratorStub)
  return {
    sut,
    registerAccountRepositoryStub,
    passwordGeneratorStub
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
    expect(repoSpy).toHaveBeenCalledWith(fakeCredentials())
  })

  test('Should call PasswordGenerator', async () => {
    const { sut, passwordGeneratorStub } = makeSut()
    const generatorSpy = jest.spyOn(passwordGeneratorStub, 'generate')
    await sut.register(fakeCredentials())
    expect(generatorSpy).toHaveBeenCalledTimes(1)
  })
})
