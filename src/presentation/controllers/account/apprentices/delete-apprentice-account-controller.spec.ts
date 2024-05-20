import { LoadAccountById } from '@/domain/use-cases/load-account-by-id'
import { DeleteAccountById } from '@/domain/use-cases/delete-account-by-id'
import { AccountModel } from '@/domain/models/account'
import { HttpRequest } from '@/presentation/protocols'
import { badRequest, noContent, notFound, serverError } from '@/presentation/helpers/http-helper'
import { AccountNotFoundError } from '@/presentation/errors/account-not-found-error'
import { DeleteError } from '@/presentation/errors/delete-error'
import { Validator } from '@/presentation/protocols/validator'
import { InvalidParamError } from '@/presentation/errors/invalid-params'
import { DeleteApprenticeController } from './delete-apprentice-account-controller'

type Sut = {
  sut: DeleteApprenticeController
  idParamValidator:Validator
  loadAccountByIdStub: LoadAccountById
  deleteApprenticeAccountById: DeleteAccountById,
}

const makeSut = (): Sut => {
  const idParamValidator = makeValidatorStub()
  const loadAccountByIdStub = makeLoadAccountByIdStub()
  const deleteApprenticeAccountById = makeDeleteApprenticeAccountByIdStub()
  const sut = new DeleteApprenticeController(idParamValidator, loadAccountByIdStub, deleteApprenticeAccountById)
  return {
    sut,
    idParamValidator,
    loadAccountByIdStub,
    deleteApprenticeAccountById
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

const makeDeleteApprenticeAccountByIdStub = (): DeleteAccountById => {
  class DeleteApprenticeAccountByIdStub implements DeleteAccountById {
    deleteById (accountId: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new DeleteApprenticeAccountByIdStub()
}

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: object): Error {
      return null
    }
  }
  return new ValidatorStub()
}

const fakeAccountModel = (): AccountModel => ({
  _id: 'any_id',
  name: 'any_name',
  email: 'any_email@hotmail.com',
  role: 'apprentice',
  password: 'hashed_password',
  createdAt: new Date()
})

const fakeRequest = (): HttpRequest => ({
  params: {
    id: 'any_id'
  }
})

describe('DeleteApprenticeController', () => {
  test('Should call IdParamValidation with correct id param', async () => {
    const { sut, idParamValidator } = makeSut()
    const idValidatorSpy = jest.spyOn(idParamValidator, 'validate')
    await sut.handle(fakeRequest())
    expect(idValidatorSpy).toHaveBeenCalledWith(fakeRequest().params)
  })

  test('Should return 400 if IdParamValidation returns error', async () => {
    const { sut, idParamValidator } = makeSut()
    jest.spyOn(idParamValidator, 'validate').mockReturnValueOnce(new InvalidParamError('id'))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(badRequest(new InvalidParamError('id')))
  })

  test('Should return 500 if IdParamValidation throws', async () => {
    const { sut, idParamValidator } = makeSut()
    jest.spyOn(idParamValidator, 'validate').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })

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

  test('Should return 404 if account is not apprentice', async () => {
    const { sut, loadAccountByIdStub } = makeSut()
    jest.spyOn(loadAccountByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve({ ...fakeAccountModel(), role: 'other_role' }))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(notFound(new AccountNotFoundError()))
  })

  test('Should call DeleteAccountById with correct id', async () => {
    const { sut, deleteApprenticeAccountById } = makeSut()
    const deleteApprenticeAccountSpy = jest.spyOn(deleteApprenticeAccountById, 'deleteById')
    await sut.handle(fakeRequest())
    expect(deleteApprenticeAccountSpy).toHaveBeenCalledWith(fakeAccountModel()._id)
  })

  test('Should return 500 if deletion fails', async () => {
    const { sut, deleteApprenticeAccountById } = makeSut()
    jest.spyOn(deleteApprenticeAccountById, 'deleteById').mockReturnValueOnce(Promise.resolve(false))
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
    const { sut, deleteApprenticeAccountById } = makeSut()
    jest.spyOn(deleteApprenticeAccountById, 'deleteById').mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle(fakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })
})
