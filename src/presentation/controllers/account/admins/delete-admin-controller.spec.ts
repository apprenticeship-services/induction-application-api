import { LoadAccountById } from '@/domain/use-cases/load-account-by-id'
import { DeleteAdminController } from './delete-admin-controller'
import { DeleteAccountById } from '@/domain/use-cases/delete-account-by-id'
import { AccountModel } from '@/domain/models/account'
import { HttpRequest } from '@/presentation/protocols'
import { noContent, notFound, serverError } from '@/presentation/helpers/http-helper'
import { AccountNotFoundError } from '@/presentation/errors/account-not-found-error'
import { DeleteError } from '@/presentation/errors/delete-error'

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

  test('Should return 404 if id is not linked to any account', async () => {
    const { sut, loadAccountByIdStub } = makeSut()
    jest.spyOn(loadAccountByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(notFound(new AccountNotFoundError()))
  })

  test('Should call DeleteAccountById with correct id', async () => {
    const { sut, deleteAccountByIdStub } = makeSut()
    const loadAccountSpy = jest.spyOn(deleteAccountByIdStub, 'deleteById')
    await sut.handle(fakeRequest())
    expect(loadAccountSpy).toHaveBeenCalledWith(fakeAccountModel()._id)
  })

  test('Should return 500 if deletion fails', async () => {
    const { sut, deleteAccountByIdStub } = makeSut()
    jest.spyOn(deleteAccountByIdStub, 'deleteById').mockReturnValueOnce(Promise.resolve(false))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(serverError(new DeleteError('Account deletion failed')))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(noContent())
  })

  test('Should return 500 if LoadAccountById throws', async () => {
    const { sut, loadAccountByIdStub } = makeSut()
    jest.spyOn(loadAccountByIdStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 500 if LoadAccountById throws', async () => {
    const { sut, deleteAccountByIdStub } = makeSut()
    jest.spyOn(deleteAccountByIdStub, 'deleteById').mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })
})
