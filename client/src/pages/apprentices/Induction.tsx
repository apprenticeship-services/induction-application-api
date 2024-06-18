import { Button } from '@/components/ui/button'
import Video from '@/components/video/Video'
import useFetchApprenticeDetails from '@/hooks/apprentice/useFetchApprenticeDetails'
import { LockKeyhole } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const Induction = () => {
  const { query: { data } } = useFetchApprenticeDetails()
  const navigate = useNavigate()
  return (
    <main>
      <div className="">
        <div className="max-w-[1000px] mx-auto">
          <h1 className="text-3xl text-foreground font-semibold">
            Why do I need an induction?
          </h1>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto p-4 flex flex-col gap-5 text-sm sm:text-base">
        <p>
        Starting an apprenticeship is an exciting step. Our induction ensures you are prepared, providing essential information about your program, expectations, and available resources. This helps you navigate your apprenticeship successfully and maximize learning experiences.
        </p>
        <p>
        You will learn about our policies, health and safety guidelines, and your rights and responsibilities. The induction also introduces you to our staff and resources. Watching the induction video is crucial as it gives an overview of what to expect and how to make the most of your apprenticeship.
        </p>
      </div>

      {/* <button
        className="bg-yellow-500 p-2 rounded text-white"
        onClick={() => mutationInduction.mutate() }
      >
        Toggle Induction
      </button> */}
      <div className="flex justify-center ">
        <div className="max-w-[1000px] shadow-lg shadow-slate-500/50">
          <div className="p-4 border-solid border-[1px] border-gray-300">
            <h2 className="text-base sm:text-xl font-semibold">
              Watch the video
            </h2>
          </div>
          <Video />
          <div className="flex justify-end px-4 py-2">
                      <Button
                          className='flex gap-2'
              disabled={!data?.induction }
              onClick={() => navigate('/assessment')}
            >
                Go To Assessment
                {!data?.induction && <LockKeyhole size={16}/>}
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
