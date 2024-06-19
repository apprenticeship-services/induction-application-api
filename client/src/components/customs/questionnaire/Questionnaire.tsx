import { dumbData, Question } from './questions'
import * as z from 'zod'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import useFetchApprenticeDetails from '@/hooks/apprentice/useFetchApprenticeDetails'
import { UserAnswer } from './types/UserAnswer'
import useLocalStorage from '@/hooks/local_storage/useLocalStorage'

const questionnaireSchema = z.object({
  answers: z.object({
    question1: z.literal('a'),
    question2: z.literal('b'),
    question3: z.literal('c'),
    question4: z.literal('d'),
    question5: z.literal('a')
  })
})

type Questionnaire = z.infer<typeof questionnaireSchema>;

type CorrectAnswer = {
  [key: string]: {value: string; tip: string};
};

type QuestionnaireProps = {
  resetForm: () => void;
};

const Questionnaire = ({ resetForm }: QuestionnaireProps) => {
  const { query, mutationAssessment } = useFetchApprenticeDetails()
  const [countScore, setCountScore] = useState<number>(query?.data?.assessment ? 5 : 0)
  const [correctAnswers] = useState<CorrectAnswer>({
    question1: {
      value: 'a',
      tip: 'Review video at 09:00'
    },
    question2: {
      value: 'b',
      tip: 'Review video at 15:00'
    },
    question3: {
      value: 'c',
      tip: 'Review video at 05:00'
    },
    question4: {
      value: 'd',
      tip: 'Review video at 03:00'
    },
    question5: {
      value: 'a',
      tip: 'Review video at 14:00'
    }
  })
  const [savedQuestions, updateSavedQuestions] = useLocalStorage<UserAnswer>('questions', {})
  const [submitted, updateSubmission] = useLocalStorage<boolean>('questionnaire-submitted', false)

  const [userAnswers, setUserAnswers] = useState<UserAnswer>({
    question1: query?.data?.assessment ? 'a' : savedQuestions.question1,
    question2: query?.data?.assessment ? 'b' : savedQuestions.question2,
    question3: query?.data?.assessment ? 'c' : savedQuestions.question3,
    question4: query?.data?.assessment ? 'd' : savedQuestions.question4,
    question5: query?.data?.assessment ? 'a' : savedQuestions.question5
  })
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateSubmission(true)
    try {
      const result = checkAnswer()
      if (result === 5) {
        if (query?.data?.assessment) {
          return
        }
        const promise = mutationAssessment.mutateAsync(userAnswers)
        toast.promise(promise, {
          loading: 'Submitting assessment...',
          success: () => {
            return 'You completed your assessment!'
          },
          error: (error) => {
            updateSubmission(false)
            if (error.response && error.response.data && error.response.data.error) {
              return error.response.data.error
            }
            return 'Error while submitting your assessment. Please try again later!'
          }
        })
      } else {
        toast.error('You must score 100% to complete the assessment.\nPlease, review your incorrect answers, reset the form and submit again.')
      }
    } catch (error) {
      const e = error as AxiosError
      toast.error(e.response?.data as string)
      updateSubmission(false)
    }
  }

  const onChange = (id: number, e: ChangeEvent<HTMLInputElement>) => {
    setUserAnswers((prev) => ({
      ...prev,
      [`question${id}`]: e.target.value
    }))
    updateSavedQuestions({
      ...userAnswers,
      [`question${id}`]: e.target.value
    })
  }

  const reset = () => {
    setUserAnswers({
      1: null,
      2: null,
      3: null,
      4: null,
      5: null
    })
    updateSubmission(false)
    resetForm()
  }

  const checkAnswer = () => {
    const correct = Object.keys(userAnswers).reduce(
      (acc, key) =>
        userAnswers[key] === correctAnswers[key].value
          ? acc + 1
          : acc,
      0
    )
    setCountScore(correct)
    return correct
  }

  return (
    <div className='border-b-2 border-solid border-slate-400 rounded-b-lg shadow-lg shadow-slate-500/50'>
      <form onSubmit={onSubmit} className="py-4 ">
        <div className="flex flex-col gap-7 px-4 sm:px-9 py-4 sm:py-6 ">
          {dumbData.map((question: Question, index: number) => (
            <div key={`question${index + 1}`} className="flex flex-col">
              <h2 className="text-base ">
                {index + 1}. {question.question}
              </h2>
              <div className="px-4 flex flex-col gap-2">
                <div className={`${(submitted || query?.data?.assessment) ? 'block' : 'invisible py-2'}`}>
                  {(submitted || query?.data?.assessment) && (
                    <>
                      {userAnswers[`question${index + 1}`] ===
                      correctAnswers[`question${index + 1}`].value
                        ? (
                        <span className="text-green-600  text-xs font-semibold ">
                          CORRECT!
                        </span>
                          )
                        : (
                        <p className="text-red-600  text-xs font-semibold">
                          INCORRECT{' '}
                          <span className="text-slate-700 ">
                            - {correctAnswers[`question${index + 1}`].tip}
                          </span>
                        </p>
                          )}
                    </>
                  )}
                </div>
                {Object.entries(question.options).map(([key, value]) => (
                  <div key={key}>
                    <span>{key}. </span>
                    <label
                      className={`${
                        (!submitted || !query?.data?.assessment) && 'cursor-pointer'
                      } text-sm sm:text-base`}
                    >
                      <input
                        disabled={(submitted || query?.data?.assessment) }
                        name={(index + 1).toString()}
                        type="radio"
                        value={key}
                        checked={key === userAnswers[`question${index + 1}`]}
                        className={`${(!submitted || !query?.data?.assessment) && 'cursor-pointer'} `}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          onChange(index + 1, e)
                        }
                      />
                      {' ' + value}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <p className={`font-bold ${submitted ? 'block' : 'block'}`}>
            Your score: {countScore}/{Object.entries(correctAnswers).length} (
            {(countScore * 100) / Object.entries(correctAnswers).length}%)
          </p>
        </div>

        <div className="flex gap-2 justify-center items-center">
          <button
            className={`px-4 sm:px-8 py-2 sm:py-3 font-bold text-sm sm:text-base ${
                (submitted || query?.data?.assessment)
                ? 'bg-slate-400 text-white'
                : 'text-white bg-foreground rounded-sm hover:bg-slate-700 active:scale-[0.98]'
            } focus:outline-none focus:shadow-outline transition`}
            type="submit"
            disabled={(submitted || query?.data?.assessment)}
          >
            SUBMIT
          </button>
          <button
            type="button"
            className="px-4 sm:px-8 py-2 sm:py-3 font-bold text-sm sm:text-base  text-black  rounded-sm hover:bg-slate-400 transition focus:outline-none focus:shadow-outline active:scale-[0.98]"
            onClick={reset}
            disabled={query?.data?.assessment}
          >
            RESET
          </button>
        </div>
      </form>
    </div>
  )
}

export default Questionnaire
