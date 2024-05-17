import { RegisterAccountRepository, RegisterAccountRepositoryParams } from '@/data/protocols/db/register-account-repository'
import { DbRegisterAdminAccount } from './db-register-admin-account'
import { AccountModel } from '@/domain/models/account'
import { Generator } from '@/data/protocols/generator/generator'
import { Hasher } from '@/data/protocols/cryptography/hasher'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-by-email-repository'
import MockDate from 'mockdate'
import { RegistrationEmailService, RegistrationEmailServiceParams } from '@/data/protocols/email/registration-email-service'
import { DbRegisterApprenticeAccount } from './db-register-apprentice-account'
import { ApprenticeInformationParams, RegisterApprenticeInformationRepository } from '@/data/protocols/db/register-apprentice-induction-information'
import { RegisterApprenticeAccountParams } from '@/domain/use-cases/register-apprentice-account'

type Sut = {
    sut: DbRegisterApprenticeAccount,
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
    passwordGeneratorStub: Generator,
    hasherStub: Hasher,
    registerAccountRepositoryStub: RegisterAccountRepository,
    registerApprenticeInformationRepositoryStub: RegisterApprenticeInformationRepository
    registrationEmailServiceStub: RegistrationEmailService
}

const makeSut = (): Sut => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const passwordGeneratorStub = makePasswordGeneratorStub()
  const hasherStub = makeHasherStub()
  const registerAccountRepositoryStub = makeRegisterAccountRepositoryStub()
  const registerApprenticeInformationRepositoryStub = makeRegisterApprenticeInformationRepositoryStub()
  const registrationEmailServiceStub = makeRegistrationEmailServiceStub()
  const sut = new DbRegisterApprenticeAccount(
    loadAccountByEmailRepositoryStub,
    passwordGeneratorStub,
    hasherStub,
    registerAccountRepositoryStub,
    registerApprenticeInformationRepositoryStub,
    registrationEmailServiceStub)
  return {
    sut,
    registerAccountRepositoryStub,
    passwordGeneratorStub,
    hasherStub,
    loadAccountByEmailRepositoryStub,
    registerApprenticeInformationRepositoryStub,
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

const makeRegisterApprenticeInformationRepositoryStub = (): RegisterApprenticeInformationRepository => {
  class RegisterApprenticeInformationRepositoryStub implements RegisterApprenticeInformationRepository {
    register (apprenticeInformation: ApprenticeInformationParams): Promise<void> {
      return null
    }
  }
  return new RegisterApprenticeInformationRepositoryStub()
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
  role: 'apprentice',
  password: 'hashed_password',
  createdAt: new Date()
})

const fakeApprenticeInformation = (): RegisterApprenticeAccountParams => ({
  name: 'any_name',
  email: 'any_email@hotmail.com',
  advisor: 'any_advisor',
  trade: 'any_trade'
})

describe('DbRegisterApprenticeAccount', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.register(fakeApprenticeInformation())
    expect(loadByEmailSpy).toHaveBeenCalledWith(fakeApprenticeInformation().email)
  })
})
