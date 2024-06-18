import { BookUser, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '@/assets/sidebar-logo.png'

const SideBar = () => {
  const [isAdmin] = useState<boolean>(true)

  return (
    <>
      {isAdmin && (
        <aside
          id="sidebar"
          className={'flex flex-col py-4 px-6  h-[100dvh] w-[300px]  bg-black relative transition-all duration-100 overflow-y-auto overflow-x-hidden'}
        >
          <div
            className={'text-white flex justify-center gap-4 py-2 rounded mr-2 text-decoration-none'}
          >
            <img src={logo} className="bg-contain bg-no-repeat"></img>
          </div>
          <ul className={'pl-0 mt-10 flex flex-col h-full gap-3'}>
                <li className=" opacity-70 translate-x-[-3px]">
                  <label className="text-slate-400 translate-x-[-10px] text-xs">
                    Users
                  </label>
                  <div className="w-full translate-x-[-3px] border-b-2 border-slate-400 "></div>
                </li>
                <Link
                  to={'apprentices'}
                  className="text-white text-xl  flex items-center gap-x-2 cursor-pointer p-2 hover:bg-white hover:text-black rounded mr-2 text-decoration-none "
                >
                  <span className="text-2xl font-extrabold float-left">
                  <BookUser size={30} />
                  </span>
                  <span
                    className={'font-semibold  text-base'}
                  >
                    Apprentices
                  </span>
                </Link>
                <li className=" opacity-70 translate-x-[-3px] mt-3">
                  <label className="text-slate-400 translate-x-[-10px] text-xs">
                    Admins
                  </label>
                  <div className="w-full translate-x-[-3px] border-b-2 border-slate-400 "></div>
                </li>
                <Link
                  to={'admins'}
                  className="text-white text-xl  flex items-center gap-x-2 cursor-pointer p-2 hover:bg-white hover:text-black rounded mr-2
               text-decoration-none"
                >
                  <span className="text-2xl font-extrabold float-left">
                  <ShieldCheck size={30} />
                  </span>
                  <span
                    className={'text-base font-semibold'}
                  >
                    Admins
                  </span>
                </Link>
          </ul>
        </aside>
      )}
    </>
  )
}

export default SideBar
