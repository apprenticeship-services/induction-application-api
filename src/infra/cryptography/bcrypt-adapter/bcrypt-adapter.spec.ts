import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

const salt = 12

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return Promise.resolve('hashed_password')
  }
}))

const fakeValue = ():string => 'any_value'

describe('BcryptAdapter', () => {
  test('Should call bcrypt compare method with correct values', async () => {
    const sut = new BcryptAdapter()
    const bcryptSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash(fakeValue())
    expect(bcryptSpy).toHaveBeenCalledWith(fakeValue(), 12)
  })
})
