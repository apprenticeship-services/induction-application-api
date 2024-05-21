export class ApprenticeNotFoundError extends Error {
  constructor () {
    super('Apprentice not found')
    this.name = 'ApprenticeNotFoundError'
  }
}
