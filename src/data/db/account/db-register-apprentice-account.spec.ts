import { RegisterAccountRepository, RegisterAccountRepositoryParams } from '@/data/protocols/db/register-account-repository'
import { AccountModel } from '@/domain/models/account'
import { Generator } from '@/data/protocols/generator/generator'
import { Hasher } from '@/data/protocols/cryptography/hasher'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-by-email-repository'
import MockDate from 'mockdate'
import { RegistrationEmailService, RegistrationEmailServiceParams } from '@/data/protocols/email/registration-email-service'
import { DbRegisterApprenticeAccount } from './db-register-apprentice-account'
import { ApprenticeInformationParams, RegisterApprenticeInformationRepository } from '@/data/protocols/db/register-apprentice-induction-information'
import { RegisterApprenticeAccountParams } from '@/domain/use-cases/register-apprentice-account'
import { TransactionManager } from '@/data/protocols/transaction/transaction-manager'

type Sut = {
    sut: DbRegisterApprenticeAccount,
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
    passwordGeneratorStub: Generator,
    hasherStub: Hasher,
    transactionManagerStub: TransactionManager,
    registerAccountRepositoryStub: RegisterAccountRepository,
    registerApprenticeInformationRepositoryStub: RegisterApprenticeInformationRepository
    registrationEmailServiceStub: RegistrationEmailService
}

const makeSut = (): Sut => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const passwordGeneratorStub = makePasswordGeneratorStub()
  const hasherStub = makeHasherStub()
  const transactionManagerStub = makeTransactionManagerStub()
  const registerAccountRepositoryStub = makeRegisterAccountRepositoryStub()
  const registerApprenticeInformationRepositoryStub = makeRegisterApprenticeInformationRepositoryStub()
  const registrationEmailServiceStub = makeRegistrationEmailServiceStub()
  const sut = new DbRegisterApprenticeAccount(
    loadAccountByEmailRepositoryStub,
    passwordGeneratorStub,
    hasherStub,
    transactionManagerStub,
    registerAccountRepositoryStub,
    registerApprenticeInformationRepositoryStub,
    registrationEmailServiceStub)
  return {
    sut,
    registerAccountRepositoryStub,
    passwordGeneratorStub,
    hasherStub,
    transactionManagerStub,
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

const makeTransactionManagerStub = (): TransactionManager => {
  class TransactionManagerStub implements TransactionManager {
    async executeTransaction<T> (transaction: () => Promise<T>): Promise<T> {
      return transaction()
    }
  }
  return new TransactionManagerStub()
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

const fakeAccountRegistration = (): RegisterAccountRepositoryParams => ({
  name: 'any_name',
  email: 'any_email@hotmail.com',
  role: 'apprentice',
  password: 'hashed_password',
  createdAt: new Date()
})

const fakeApprenticeAccountInformation = (): RegisterApprenticeAccountParams => ({
  name: 'any_name',
  email: 'any_email@hotmail.com',
  advisor: 'any_advisor',
  trade: 'any_trade'
})

const fakeApprenticeInformation = (): ApprenticeInformationParams => ({
  accountId: 'any_id',
  advisor: 'any_advisor',
  trade: 'any_trade',
  induction: false,
  assessment: false
})

describe('DbRegisterApprenticeAccount', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.register(fakeApprenticeAccountInformation())
    expect(loadByEmailSpy).toHaveBeenCalledWith(fakeApprenticeAccountInformation().email)
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.reject(new Error()))
    const account = sut.register(fakeApprenticeAccountInformation())
    expect(account).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository finds account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(fakeAccountModel()))
    const account = await sut.register(fakeApprenticeAccountInformation())
    expect(account).toBeNull()
  })

  test('Should call PasswordGenerator', async () => {
    const { sut, passwordGeneratorStub } = makeSut()
    const passwordSpy = jest.spyOn(passwordGeneratorStub, 'generate')
    await sut.register(fakeApprenticeAccountInformation())
    expect(passwordSpy).toHaveBeenCalled()
  })

  test('Should call Hasher with correct password generated', async () => {
    const { sut, hasherStub } = makeSut()
    const hasherSpy = jest.spyOn(hasherStub, 'hash')
    await sut.register(fakeApprenticeAccountInformation())
    expect(hasherSpy).toHaveBeenCalledWith('any_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
    const account = sut.register(fakeApprenticeAccountInformation())
    expect(account).rejects.toThrow()
  })

  test('Should call RegisterAccountRepository with correct values', async () => {
    const { sut, registerAccountRepositoryStub } = makeSut()
    const registerSpy = jest.spyOn(registerAccountRepositoryStub, 'register')
    await sut.register(fakeApprenticeAccountInformation())
    expect(registerSpy).toHaveBeenCalledWith(fakeAccountRegistration())
  })

  test('Should throw if RegisterAccountRepository throws', async () => {
    const { sut, registerAccountRepositoryStub } = makeSut()
    jest.spyOn(registerAccountRepositoryStub, 'register').mockReturnValueOnce(Promise.reject(new Error()))
    const account = sut.register(fakeApprenticeAccountInformation())
    expect(account).rejects.toThrow()
  })

  test('Should call RegisterApprenticeInformationRepository with correct values', async () => {
    const { sut, registerApprenticeInformationRepositoryStub } = makeSut()
    const registerSpy = jest.spyOn(registerApprenticeInformationRepositoryStub, 'register')
    await sut.register(fakeApprenticeAccountInformation())
    expect(registerSpy).toHaveBeenCalledWith(fakeApprenticeInformation())
  })

  test('Should throw if RegisterApprenticeInformationRepository throws', async () => {
    const { sut, registerApprenticeInformationRepositoryStub } = makeSut()
    jest.spyOn(registerApprenticeInformationRepositoryStub, 'register').mockReturnValueOnce(Promise.reject(new Error()))
    const account = sut.register(fakeApprenticeAccountInformation())
    expect(account).rejects.toThrow()
  })

  test('Should call RegistrationEmailService with correct values', async () => {
    const { sut, registrationEmailServiceStub } = makeSut()
    const emailServiceSpy = jest.spyOn(registrationEmailServiceStub, 'sendRegistrationMail')
    await sut.register(fakeApprenticeAccountInformation())
    expect(emailServiceSpy).toHaveBeenCalledWith({
      name: fakeApprenticeAccountInformation().name,
      emailTo: fakeApprenticeAccountInformation().email,
      password: 'any_password',
      role: 'apprentice'
    })
  })

  test('Should throw if RegistrationEmailService throws', async () => {
    const { sut, registrationEmailServiceStub } = makeSut()
    jest.spyOn(registrationEmailServiceStub, 'sendRegistrationMail').mockReturnValueOnce(Promise.reject(new Error()))
    const account = sut.register(fakeApprenticeAccountInformation())
    expect(account).rejects.toThrow()
  })

  test('Should call TransactionManager with correct transaction', async () => {
    const {
      sut,
      transactionManagerStub,
      registerAccountRepositoryStub,
      registerApprenticeInformationRepositoryStub,
      registrationEmailServiceStub
    } = makeSut()
    const executeTransactionSpy = jest.spyOn(transactionManagerStub, 'executeTransaction')
    await sut.register(fakeApprenticeAccountInformation())

    expect(executeTransactionSpy).toHaveBeenCalled()

    const registerAccountSpy = jest.spyOn(registerAccountRepositoryStub, 'register')
    const registerApprenticeSpy = jest.spyOn(registerApprenticeInformationRepositoryStub, 'register')
    const sendEmailSpy = jest.spyOn(registrationEmailServiceStub, 'sendRegistrationMail')

    await executeTransactionSpy.mock.calls[0][0]()

    expect(registerAccountSpy).toHaveBeenCalledWith(fakeAccountRegistration())
    expect(registerApprenticeSpy).toHaveBeenCalledWith(fakeApprenticeInformation())
    expect(sendEmailSpy).toHaveBeenCalledWith({
      name: fakeApprenticeAccountInformation().name,
      emailTo: fakeApprenticeAccountInformation().email,
      password: 'any_password',
      role: 'apprentice'
    })
  })

  test('Should throw if TransactionManager throws', async () => {
    const {
      sut,
      transactionManagerStub
    } = makeSut()
    jest.spyOn(transactionManagerStub, 'executeTransaction').mockRejectedValueOnce(new Error())
    const account = sut.register(fakeApprenticeAccountInformation())
    expect(account).rejects.toThrow()
  })

  test('Should return account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.register(fakeApprenticeAccountInformation())
    expect(account).toEqual(fakeAccountModel())
  })
})
