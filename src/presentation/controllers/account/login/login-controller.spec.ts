import { Validator } from '@/presentation/protocols/validator'
import { LoginController } from './login-controller'
import { AuthenticationParams } from '@/domain/use-cases/authentication'
import { HttpRequest } from '@/presentation/protocols'

type Sut = {
    sut: LoginController
    validatorStub: Validator
}

const makeSut = (): Sut => {
  const validatorStub = makeValidatorStub()
  const sut = new LoginController(validatorStub)
  return {
    sut,
    validatorStub
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

const fakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@hotmail.com',
    password: 'any_password'
  }
})

describe('Login Controller', () => {
  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validatorSpy = jest.spyOn(validatorStub, 'validate')
    await sut.handle(fakeRequest())
    expect(validatorSpy).toHaveBeenCalledWith(fakeRequest().body)
  })
})
