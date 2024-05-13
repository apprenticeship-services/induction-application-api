import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

const salt = 12

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return Promise.resolve('hashed_value')
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

  test('Should throw if hash throws', async () => {
    const sut = new BcryptAdapter()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => Promise.reject(new Error()))
    const hashedValue = sut.hash(fakeValue())
    expect(hashedValue).rejects.toThrow()
  })

  test('Should return hashed value on success', async () => {
    const sut = new BcryptAdapter()
    const hashedValue = await sut.hash(fakeValue())
    expect(hashedValue).toBe('hashed_value')
  })
})
