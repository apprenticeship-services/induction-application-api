import useFetchApprenticeDetails from '@/hooks/apprentice/useFetchApprenticeDetails'
import { LockKeyhole, SquareCheckBig } from 'lucide-react'
// import { useState } from 'react' MenuIcon,
import { Link, useLocation } from 'react-router-dom'

const InductionNavigation = () => {
  const { query: { data } } = useFetchApprenticeDetails()
  const { pathname } = useLocation()
  const appLocation: string = pathname.split('/')[1]
  console.log(appLocation)
  // const [mobileOpen, setMobileOpen] = useState<boolean>()

  return (
    <>
      {/* Mobile Menu */}
      {/* <div
        className="visible md:invisible bg-slate-500 text-slate-200 text-3xl absolute top-4 left-3 rounded px-1 hover:bg-slate-50 hover:text-slate-700 cursor-pointer transition"
        onClick={() => setMobileOpen((prev) => !prev)} // toggle isNavOpen state on click
      >
        <MenuIcon />
      </div>
      <div
        className={` ${
          mobileOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }  absolute top-0 left-0 w-screen h-screen flex z-20 transition-all`}
      >
        <aside className="py-8 px-6 border-r-[1px]  border-b-[1px] border-solid bg-slate-300 border-gray-300">
          <h2 className="whitespace-nowrap text-lg text-gray-800">
            INDUCTION PHASES
          </h2>
          <ul className="flex flex-col gap-8 p-2 whitespace-nowrap pt-5">
            <Link
              to={''}
              className="flex gap-2 items-center cursor-pointer hover:opacity-75"
            >
              <div
                className={'flex items-center justify-center  text-xs font-semibold rounded-sm text-white  w-[25px] h-[24px]'}
              >
                <span className="pt-0.5">1</span>
              </div>
              <div
                className={'flex items-center gap-1 '}
              >
                <span>Introduction</span>
                {induction && (
                  <SquareCheckBig className="inline-block -translate-y-[1px] " />
                )}
              </div>
            </Link>
            <Link
              to={induction ? 'assessment' : '#'}
              className={`flex gap-2 items-center   ${
                induction
                  ? 'cursor-pointer opacity-100 hover:opacity-75'
                  : 'cursor-default opacity-50'
              }`}
            >
              <div
                className={`flex items-center justify-center ${
                  appLocation ? 'bg-orange-400' : 'bg-gray-500'
                }  text-xs font-semibold rounded-sm text-white  w-[25px] h-[24px]`}
              >
                <span className="pt-0.5">2</span>
              </div>
              <div
                className={`flex items-center gap-1 ${
                  appLocation && 'text-orange-400'
                }`}
              >
                <span>Assessment</span>
                {induction
                  ? (
                      assessment && (
                        <SquareCheckBig className="inline-block -translate-y-[1px] " />
                      )
                    )
                  : (
                    <LockKeyhole className="inline-block -translate-y-[1px] text-xl" />
                    )}
              </div>
            </Link>
          </ul>
        </aside>
        <div
          className="bg-black bg-opacity-70 w-full h-full"
          onClick={() => setMobileOpen((prev) => !prev)}
        ></div>
      </div> */}

      {/* Normal Menu */}
      <div className="hidden md:flex">
        <aside className="py-8 px-6 border-r-[1px]  border-b-[1px] border-solid bg-foreground ">
          <h2 className="whitespace-nowrap text-lg text-white">
            INDUCTION PHASES
          </h2>
          <ul className="flex flex-col gap-4 p-2 whitespace-nowrap pt-5">
            <Link
              to={'/induction'}
              className={'flex gap-2  p-2 rounded items-center cursor-pointer transition-all text-white group hover:bg-white hover:text-foreground'}
            >
              <div
                className={'flex items-center justify-center text-foreground transition-all bg-white group-hover:bg-black group-hover:text-white text-xs font-semibold rounded-sm  w-[25px] h-[24px]'}
              >
                <span className="pt-0.5">1</span>
              </div>
              <div
                className={'flex items-center gap-1'}
              >
                <span>Introduction</span>
                {data?.induction && (
                  <SquareCheckBig className="inline-block -translate-y-[1px] " />
                )}
              </div>
            </Link>
            <Link
              to={'assessment'}

              className={`flex gap-2 p-2 rounded items-center transition-all text-white group hover:bg-white hover:text-foreground ${
                data?.induction
                  ? appLocation === 'assessment' && 'pointer-events-none'
                  : 'cursor-default opacity-50 pointer-events-none'
              }`}
            >
              <div
                className={'flex items-center justify-center bg-white text-foreground group-hover:bg-black group-hover:text-white text-xs font-semibold rounded-sm  w-[25px] h-[24px]'}
              >
                <span className="pt-0.5">2</span>
              </div>
              <div
                className={'flex items-center gap-1'}
              >
                <span>Assessment</span>
                {data?.induction
                  ? (
                      data.assessment && (
                    <SquareCheckBig className="inline-block -translate-y-[1px] " />
                      )
                    )
                  : (
                  <LockKeyhole className="inline-block -translate-y-[1px] text-xl" />
                    )}
              </div>
            </Link>
          </ul>
        </aside>
      </div>
    </>
  )
}

export default InductionNavigation
