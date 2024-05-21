import { EncryptDetails } from '@/data/protocols/cryptography/encrypter'
import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'
import { AccountTokenPayload } from '@/data/protocols/cryptography/decrypter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise(resolve => resolve('json_token'))
  },
  async verify (): Promise<AccountTokenPayload> {
    return new Promise(resolve => resolve({
      _id: 'any_id',
      role: 'any_role'
    }))
  }
}))

const fakeEncryptDetails = (): EncryptDetails => ({
  _id: 'any_id',
  role: 'any_role'
})

describe('JwtAdapter', () => {
  describe('METHOD: encrypt()', () => {
    test('Should call jwt sign() with correct values', async () => {
      const sut = new JwtAdapter('secret')
      const encryptSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt(fakeEncryptDetails())
      expect(encryptSpy).toHaveBeenCalledWith(fakeEncryptDetails(), 'secret')
    })

    test('Should throw if jwt sign() throws', async () => {
      const sut = new JwtAdapter('secret')
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => Promise.reject(new Error()))
      const tokenResponse = sut.encrypt(fakeEncryptDetails())
      expect(tokenResponse).rejects.toThrow()
    })

    test('Should return token on success', async () => {
      const sut = new JwtAdapter('secret')
      const tokenResponse = await sut.encrypt(fakeEncryptDetails())
      expect(tokenResponse).toBeTruthy()
      expect(tokenResponse).toBe('json_token')
    })
  })

  describe('verify()', () => {
    test('Should call verify with correct values', async () => {
      const sut = new JwtAdapter('secret')
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })

    test('Should return decoded account on success', async () => {
      const sut = new JwtAdapter('secret')
      const value = await sut.decrypt('any_token')
      expect(value._id).toBe('any_id')
      expect(value.role).toBe('any_role')
    })

    test('Should throw if jwt verify throws', async () => {
      const sut = new JwtAdapter('secret')
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.decrypt('any_token')
      expect(promise).rejects.toThrow()
    })
  })
})
