import { noContent } from '@/presentation/helpers/http-helper'
import { LogoutController } from './logout-controller'
import env from '@/main/config/env'

describe('LogoutController', () => {
  let originalEnv: string

  beforeAll(() => {
    originalEnv = env.nodeEnvironment
  })

  afterEach(() => {
    env.nodeEnvironment = originalEnv
    jest.clearAllMocks()
  })

  test('Should return 204 on success and clean token with sameSite lax in development', async () => {
    env.nodeEnvironment = 'development'
    const sut = new LogoutController()
    const response = await sut.handle({})

    const expectedTokenHeader = {
      token: {
        type: 'clearCookie',
        value: null,
        options: {
          httpOnly: true,
          secure: false,
          sameSite: 'lax'
        }
      }
    }
    expect(response).toEqual(noContent(expectedTokenHeader))
  })

  test('Should return 204 on success and clean token with sameSite strict in production', async () => {
    env.nodeEnvironment = 'production'
    const sut = new LogoutController()
    const response = await sut.handle({})

    const expectedTokenHeader = {
      token: {
        type: 'clearCookie',
        value: null,
        options: {
          httpOnly: true,
          secure: true,
          sameSite: 'strict'
        }
      }
    }
    expect(response).toEqual(noContent(expectedTokenHeader))
  })
})
