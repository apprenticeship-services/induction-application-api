export class InvalidAnswerError extends Error {
  constructor (answer: string) {
    super(`Invalid answer: Invalid answer for ${answer}`)
    this.name = 'InvalidAnswerError'
  }
}
