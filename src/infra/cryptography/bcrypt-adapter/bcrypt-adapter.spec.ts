import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt, { compare } from 'bcryptjs'

const salt = 12

jest.mock('bcryptjs', () => ({
  async hash (): Promise<string> {
    return Promise.resolve('hashed_value')
  },
  async compare (): Promise<boolean> {
    return Promise.resolve(true)
  }
}))

const fakeValue = (): string => 'any_value'

const fakeCompareValues = (): { password: string, hashedPassword: string } => ({
  password: 'any_password',
  hashedPassword: 'hashed_password'
})

describe('BcryptAdapter', () => {
  describe('METHOD: hash()', () => {
    test('Should call bcrypt hash method with correct values', async () => {
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

  describe('METHOD: compare()', () => {
    test('Should call bcrypt compare method with correct values', async () => {
      const sut = new BcryptAdapter()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare(fakeCompareValues().password, fakeCompareValues().hashedPassword)
      expect(compareSpy).toHaveBeenCalledWith(fakeCompareValues().password, fakeCompareValues().hashedPassword)
    })

    test('Should return false if bcrypt compare returns false', async () => {
      const sut = new BcryptAdapter()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
        return Promise.resolve(false)
      })
      const isValid = await sut.compare(fakeCompareValues().password, fakeCompareValues().hashedPassword)
      expect(isValid).toBe(false)
    })

    test('Should return true on success', async () => {
      const sut = new BcryptAdapter()
      const isValid = await sut.compare(fakeCompareValues().password, fakeCompareValues().hashedPassword)
      expect(isValid).toBe(true)
    })

    test('Should throw if bcrypt compare throws', async () => {
      const sut = new BcryptAdapter()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
        return Promise.reject(new Error())
      })
      const isValid = sut.compare(fakeCompareValues().password, fakeCompareValues().hashedPassword)
      expect(isValid).rejects.toThrow()
    })
  })
})
