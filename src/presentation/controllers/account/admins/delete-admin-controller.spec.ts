import { LoadAccountById } from '@/domain/use-cases/load-account-by-id'
import { DeleteAdminController } from './delete-admin-controller'
import { DeleteAccountById } from '@/domain/use-cases/delete-account-by-id'
import { AccountModel } from '@/domain/models/account'
import { HttpRequest } from '@/presentation/protocols'

type Sut = {
    sut: DeleteAdminController
    loadAccountByIdStub: LoadAccountById
    deleteAccountByIdStub: DeleteAccountById
}

const makeSut = (): Sut => {
  const loadAccountByIdStub = makeLoadAccountByIdStub()
  const deleteAccountByIdStub = makeDeleteAccountByIdStub()
  const sut = new DeleteAdminController(loadAccountByIdStub, deleteAccountByIdStub)
  return {
    sut,
    loadAccountByIdStub,
    deleteAccountByIdStub
  }
}

const makeLoadAccountByIdStub = (): LoadAccountById => {
  class LoadAccountByIdStub implements LoadAccountById {
    loadById (accountId: string): Promise<AccountModel> {
      return Promise.resolve(fakeAccountModel())
    }
  }
  return new LoadAccountByIdStub()
}

const makeDeleteAccountByIdStub = (): DeleteAccountById => {
  class DeleteAccountByIdStub implements DeleteAccountById {
    deleteById (accountId: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new DeleteAccountByIdStub()
}

const fakeAccountModel = (): AccountModel => ({
  _id: 'any_id',
  name: 'any_name',
  email: 'any_email@hotmail.com',
  role: 'any_role',
  password: 'hashed_password',
  createdAt: new Date()
})

const fakeRequest = (): HttpRequest => ({
  params: {
    id: 'any_id'
  }
})

describe('DeleteAdminController', () => {
  test('Should call LoadAccountById with correct id', async () => {
    const { sut, loadAccountByIdStub } = makeSut()
    const loadAccountSpy = jest.spyOn(loadAccountByIdStub, 'loadById')
    await sut.handle(fakeRequest())
    expect(loadAccountSpy).toHaveBeenCalledWith('any_id')
  })
})
