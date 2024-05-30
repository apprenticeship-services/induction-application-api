import Questionnaire from '@/components/customs/questionnaire/Questionnaire'
import { useState } from 'react'

export const Assessment = () => {
  const [seed, setSeed] = useState(1)
  const reset = () => {
    setSeed(Math.random())
  }
  return (
    <main className='rounded-sm'>
      <div className="bg-foreground p-4">
        <h1 className="text-xl sm:text-2xl text-white font-semibold">
          Assessment
        </h1>
      </div>
      <Questionnaire key={seed} resetForm={reset} />
    </main>
  )
}
