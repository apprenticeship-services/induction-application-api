import { InvalidParamError } from '@/presentation/errors/invalid-params'
import { AssessmentAnswers } from '../models/assessment-answers'
import { AssessmentValidator } from './assessment-validator'
import { MissingAnswerError } from '@/presentation/errors/missing-answer-error'
import { InvalidAnswerError } from '@/presentation/errors/invalid-answer-error'

const assessmentSchema: AssessmentAnswers = {
  question1: 'A',
  question2: 'B',
  question3: 'C',
  question4: 'D',
  question5: 'A'
}

describe('AssessmentValidator', () => {
  test('Should return InvalidParamError if empty object is provided', () => {
    const sut = new AssessmentValidator(assessmentSchema)
    const error = sut.validate({})
    expect(error).toEqual(new InvalidParamError('answers'))
  })

  test('Should return MissingAnswerError for first answer missing', () => {
    const sut = new AssessmentValidator(assessmentSchema)
    const error1 = sut.validate({
      answers: {}
    })
    expect(error1).toEqual(new MissingAnswerError('question1'))

    const error2 = sut.validate({
      answers: {
        question1: 'A'
      }
    })
    expect(error2).toEqual(new MissingAnswerError('question2'))
  })

  test('Should return InvalidAnswerError for first wrong answer encountered', () => {
    const sut = new AssessmentValidator(assessmentSchema)
    const error = sut.validate({
      answers: {
        question1: 'A',
        question2: 'B',
        question3: 'X',
        question4: 'D',
        question5: 'A'
      }
    })
    expect(error).toEqual(new InvalidAnswerError('question3'))
  })

  test('Should return null on success', () => {
    const sut = new AssessmentValidator(assessmentSchema)
    const error = sut.validate({
      answers: {
        question1: 'A',
        question2: 'B',
        question3: 'C',
        question4: 'D',
        question5: 'A'
      }
    })
    expect(error).toBeNull()
  })
})
