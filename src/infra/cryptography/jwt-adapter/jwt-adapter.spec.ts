import { EncryptDetails } from '@/data/protocols/cryptography/encrypter'
import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return 'json_token'
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
  })
})
