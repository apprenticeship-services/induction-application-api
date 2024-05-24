import { noContent, serverError } from '@/presentation/helpers/http-helper'
import { LogoutController } from './logout-controller'

const cleanTokenHeader = {
  token: {
    type: 'clearCookie',
    value: null,
    options: null
  }
}

describe('LogoutController', () => {
  test('Should return 204 on success and clean token', async () => {
    const sut = new LogoutController()
    const response = await sut.handle({})
    expect(response).toEqual(noContent(cleanTokenHeader))
  })
})
