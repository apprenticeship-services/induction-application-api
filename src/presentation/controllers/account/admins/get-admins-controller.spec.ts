import { LoadAdminsAccount, AdminAccount } from '@/domain/use-cases/load-admins-account'
import { serverError, success } from '@/presentation/helpers/http-helper'
import { HttpRequest } from '@/presentation/protocols'
import { GetAdminsController } from './get-admins-controller'
type SutTypes = {
  sut: GetAdminsController
  loadAdminsAccountStub: LoadAdminsAccount
}
const makeSut = (): SutTypes => {
  const loadAdminsAccountStub = makeLoadAdminsAccount()
  const sut = new GetAdminsController(loadAdminsAccountStub)
  return {
    sut,
    loadAdminsAccountStub
  }
}

const makeLoadAdminsAccount = (): LoadAdminsAccount => {
  class LoadAdminsAccountStub implements LoadAdminsAccount {
    loadAdmins (): Promise<AdminAccount[]> {
      return Promise.resolve([makeAdminAccount()])
    }
  }
  return new LoadAdminsAccountStub()
}

const makeAdminAccount = (): AdminAccount => ({
  name: 'any_name',
  accountId: 'any_id',
  email: 'any_email',
  role: 'admin',
  createdAt: 'any_date'
}
)

describe('GetAdminsController', () => {
  test('should return 200 and a list of admins on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(success([makeAdminAccount()]))
  })

  test('should return 500 if LoadAdminsAccount throws', async () => {
    const { sut, loadAdminsAccountStub } = makeSut()
    jest.spyOn(loadAdminsAccountStub, 'loadAdmins').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
