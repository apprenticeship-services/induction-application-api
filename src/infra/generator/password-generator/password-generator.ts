import { Generator } from '@/data/protocols/generator/generator'

export class PasswordGenerator implements Generator {
  generate (): string {
    const passwordLength = 7
    let randomPassword = ''
    for (let i = 0; i < passwordLength; i++) {
      const randomNumber = Math.floor(Math.random() * passwordLength)
      randomPassword += randomNumber.toString()
    }
    return randomPassword
  }
}
