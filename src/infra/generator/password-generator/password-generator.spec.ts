import { PasswordGenerator } from './password-generator'

describe('Password Generator', () => {
  test('Should return password with length 7', () => {
    const sut = new PasswordGenerator()
    const generatedPassword = sut.generate()
    expect(generatedPassword).toBeTruthy()
    expect(generatedPassword.length).toBe(7)
  })
})
