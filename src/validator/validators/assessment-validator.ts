import { InvalidAnswerError } from '@/presentation/errors/invalid-answer-error'
import { InvalidParamError } from '@/presentation/errors/invalid-params'
import { MissingAnswerError } from '@/presentation/errors/missing-answer-error'
import { Validator } from '@/presentation/protocols/validator'
import { AssessmentAnswers } from '../models/assessment-answers'

export class AssessmentValidator implements Validator {
  constructor (private readonly schema: AssessmentAnswers) {
    this.schema = schema
  }

  validate (input: any): Error {
    const { answers } = input

    if (!answers || typeof answers !== 'object') {
      return new InvalidParamError('answers')
    }

    for (const answer in this.schema) {
      if (!(answer in answers)) {
        return new MissingAnswerError(answer)
      }

      const expectedAnswer = this.schema[answer]
      const actualAnswer = answers[answer]

      if (!this.validateAnswer(expectedAnswer, actualAnswer)) {
        return new InvalidAnswerError(answer)
      }
    }
    return null // Return null if no errors
  }

  private validateAnswer (expectedAnswer: string, actualAnswer: string): boolean {
    if (expectedAnswer.toLowerCase() !== actualAnswer.toLowerCase()) {
      return false
    }
    return true
  }
}
