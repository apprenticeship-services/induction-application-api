import { RegisterAccountRepository, RegisterAccountRepositoryParams } from '@/data/protocols/db/register-account-repository'
import { DbRegisterAdminAccount } from './db-register-admin-account'
import { AccountModel } from '@/domain/models/account'
import { Generator } from '@/data/protocols/generator/generator'
import { Hasher } from '@/data/protocols/cryptography/hasher'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-by-email-repository'
import MockDate from 'mockdate'
import { RegistrationEmailService, RegistrationEmailServiceParams } from '@/data/protocols/email/registration-email-service'

type Sut = {
    sut: DbRegisterAdminAccount,
    registerAccountRepositoryStub: RegisterAccountRepository,
    passwordGeneratorStub: Generator,
    hasherStub: Hasher,
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
    registrationEmailServiceStub: RegistrationEmailService
}

const makeSut = (): Sut => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const passwordGeneratorStub = makePasswordGeneratorStub()
  const hasherStub = makeHasherStub()
  const registerAccountRepositoryStub = makeRegisterAccountRepositoryStub()
  const registrationEmailServiceStub = makeRegistrationEmailServiceStub()
  const sut = new DbRegisterAdminAccount(
    loadAccountByEmailRepositoryStub,
    passwordGeneratorStub,
    hasherStub,
    registerAccountRepositoryStub,
    registrationEmailServiceStub)
  return {
    sut,
    registerAccountRepositoryStub,
    passwordGeneratorStub,
    hasherStub,
    loadAccountByEmailRepositoryStub,
    registrationEmailServiceStub
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
      return Promise.resolve(null)
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeRegistrationEmailServiceStub = (): RegistrationEmailService => {
  class RegistrationEmailServiceStub implements RegistrationEmailService {
    async sendRegistrationMail (data: RegistrationEmailServiceParams): Promise<void> {
      return Promise.resolve(null)
    }
  }
  return new RegistrationEmailServiceStub()
}

const fakeAccountModel = (): AccountModel => ({
  _id: 'any_id',
  name: 'any_name',
  email: 'any_email@hotmail.com',
  role: 'admin',
  password: 'hashed_password',
  createdAt: new Date()
})

const fakeCredentials = (): RegisterAccountRepositoryParams => ({
  name: 'any_name',
  email: 'any_email@hotmail.com',
  password: 'any_password',
  role: 'admin',
  createdAt: new Date()
})

describe('DbRegisterAdminAccount', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())

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

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
    const response = sut.register(fakeCredentials())
    expect(response).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository finds an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(fakeAccountModel()))
    const account = await sut.register(fakeCredentials())
    expect(account).toBeNull()
  })

  test('Should call RegistrationEmailService with correct values', async () => {
    const { sut, registrationEmailServiceStub } = makeSut()
    const emailServiceSpy = jest.spyOn(registrationEmailServiceStub, 'sendRegistrationMail')
    await sut.register(fakeCredentials())
    expect(emailServiceSpy).toHaveBeenCalledWith({
      emailTo: fakeCredentials().email,
      password: fakeCredentials().password,
      role: fakeCredentials().role
    })
  })

  test('Should throw if RegistrationEmailService throws ', async () => {
    const { sut, registrationEmailServiceStub } = makeSut()
    jest.spyOn(registrationEmailServiceStub, 'sendRegistrationMail').mockReturnValueOnce(Promise.reject(new Error()))
    const account = sut.register(fakeCredentials())
    expect(account).rejects.toThrow()
  })
})
