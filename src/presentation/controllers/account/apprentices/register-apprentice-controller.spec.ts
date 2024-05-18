import { RegisterApprenticeAccount, RegisterApprenticeAccountParams } from '@/domain/use-cases/register-apprentice-account'
import { RegisterApprenticeController } from './register-apprentice-controller'
import { Validator } from '@/presentation/protocols/validator'
import { AccountModel } from '@/domain/models/account'
import { HttpRequest } from '@/presentation/protocols'

type Sut = {
    sut: RegisterApprenticeController
    validatorStub: Validator
    registerApprenticeAccountStub: RegisterApprenticeAccount
 }

const makeSut = (): Sut => {
  const validatorStub = makeValidatorStub()
  const registerApprenticeAccountStub = makeRegisterApprenticeAccountStub()
  const sut = new RegisterApprenticeController(validatorStub, registerApprenticeAccountStub)

  return {
    sut,
    validatorStub,
    registerApprenticeAccountStub
  }
}

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: object): Error {
      return null
    }
  }
  return new ValidatorStub()
}

const makeRegisterApprenticeAccountStub = (): RegisterApprenticeAccount => {
  class RegisterApprenticeAccountStub implements RegisterApprenticeAccount {
    register (apprenticeInformation: RegisterApprenticeAccountParams): Promise<AccountModel> {
      return Promise.resolve(fakeAccountModel())
    }
  }
  return new RegisterApprenticeAccountStub()
}

const fakeRequest = (): HttpRequest => ({
  body: fakeApprenticeAccount()
})

const fakeApprenticeAccount = (): RegisterApprenticeAccountParams => ({
  name: 'any_name',
  email: 'any_email@hotmail.com',
  trade: 'any_trade',
  advisor: 'any_advisor'
})

const fakeAccountModel = (): AccountModel => ({
  _id: 'any_id',
  name: 'any_name',
  role: 'apprentice',
  email: 'any_email@hotmail.com',
  password: 'any_password',
  createdAt: new Date()
})

describe('Register Apprentice Controller', () => {
  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validatorSpy = jest.spyOn(validatorStub, 'validate')
    await sut.handle(fakeRequest())
    expect(validatorSpy).toHaveBeenCalledWith(fakeRequest().body)
  })
})
