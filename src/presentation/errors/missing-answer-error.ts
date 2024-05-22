export class MissingAnswerError extends Error {
  constructor (answer: string) {
    super(`Missing answer: Missing answer for ${answer}`)
    this.name = 'MissingAnswerError'
  }
}
