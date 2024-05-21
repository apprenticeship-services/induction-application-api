import { AccountTokenPayload, Decrypter } from '@/data/protocols/cryptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { LoadAccountByIdRepository } from '@/data/protocols/db/load-account-by-id-repository'
import { AccountModel } from '@/domain/models/account'
import MockDate from 'mockdate'

type SutTypes = {
    sut: DbLoadAccountByToken,
    decrypterStub: Decrypter,
    loadAccountByIdRepositoryStub: LoadAccountByIdRepository
}
const makeSut = ():SutTypes => {
  const decrypterStub = makeDecrypter()
  const loadAccountByIdRepositoryStub = makLoadAccountByIdRepositoryStub()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByIdRepositoryStub)
  return {
    sut,
    decrypterStub,
    loadAccountByIdRepositoryStub
  }
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (token: string): Promise<AccountTokenPayload> {
      return Promise.resolve(fakeAccountTokenPayload())
    }
  }
  return new DecrypterStub()
}

const makLoadAccountByIdRepositoryStub = (): LoadAccountByIdRepository => {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    async loadById (accountId: string): Promise<AccountModel> {
      return Promise.resolve(fakeAccountModel())
    }
  }
  return new LoadAccountByIdRepositoryStub()
}

const fakeAccountTokenPayload = (): AccountTokenPayload => ({
  _id: 'any_id',
  role: 'any_role'
})

const fakeAccountModel = (): AccountModel => ({
  _id: 'any_id',
  name: 'any_name',
  email: 'any_email@hotmail.com',
  role: 'any_role',
  password: 'hashed_password',
  createdAt: new Date()
})

const fakeToken = () => 'any_token'

describe('DbLoadAccountByToken Use-case', () => {
  beforeEach(() => MockDate.set(new Date()))
  afterEach(() => MockDate.reset())
  test('Should call Decrypter with correct values', async () => {
    const role = 'any_role'
    const { sut, decrypterStub } = makeSut()
    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.loadByToken(fakeToken(), role)
    expect(decrypterSpy).toHaveBeenCalledWith(fakeToken())
  })

  test('Should return null if Decrypter returns null', async () => {
    const role = 'any_role'
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const account = await sut.loadByToken(fakeToken(), role)
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByIdRepository with correct values', async () => {
    const role = 'any_role'
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByIdRepositoryStub, 'loadById')
    await sut.loadByToken(fakeToken(), role)
    expect(loadByTokenSpy).toHaveBeenCalledWith(fakeAccountTokenPayload()._id)
  })

  test('Should return null if LoadAccountByIdRepository returns null', async () => {
    const role = 'any_role'
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const account = await sut.loadByToken(fakeToken(), role)
    expect(account).toBeNull()
  })

  test('Should return an account on success', async () => {
    const role = 'any_role'
    const { sut } = makeSut()
    const account = await sut.loadByToken(fakeToken(), role)
    expect(account).toEqual(fakeAccountModel())
  })

  test('Should throw if Decrypter throws', async () => {
    const role = 'any_role'
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(async () => { throw new Error() })
    const response = sut.loadByToken(fakeToken(), role)
    await expect(response).rejects.toThrow()
  })

  test('Should throw if LoadAccountByIdRepository throws', async () => {
    const role = 'any_role'
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockImplementationOnce(async () => { throw new Error() })
    const response = sut.loadByToken(fakeToken(), role)
    await expect(response).rejects.toThrow()
  })
})
