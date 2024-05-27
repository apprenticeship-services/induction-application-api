import { noContent, serverError } from '@/presentation/helpers/http-helper'
import { LogoutController } from './logout-controller'
import env from '@/main/config/env'

const cleanTokenHeader = {
  token: {
    type: 'clearCookie',
    value: null,
    options: {
      httpOnly: true,
      secure: true,
      sameSite: env.nodeEnvironment === 'development' ? 'none' : 'strict'
    }
  }
}

describe('LogoutController', () => {
  test('Should return 204 on success and clean token', async () => {
    const sut = new LogoutController()
    const response = await sut.handle({})
    expect(response).toEqual(noContent(cleanTokenHeader))
  })
})
