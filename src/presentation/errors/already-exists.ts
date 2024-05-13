export class AlreadyExists extends Error {
  constructor (paramInUse: string) {
    super(`The ${paramInUse} provided already exists`)
    this.name = 'Invalid Param'
  }
}
