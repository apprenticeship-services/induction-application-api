export class InvalidAssessmentRequestError extends Error {
  constructor () {
    super('You must complete induction before submitting assessment')
    this.name = 'InvalidAssessmentRequestError'
  }
}
