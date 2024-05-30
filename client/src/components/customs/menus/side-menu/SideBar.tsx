import { BookUser, LogOut, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

// type ApprenticeLink = {
//   title: string;
//   path: string;
//   icon: React.ReactNode;
// };

const SideBar = () => {
  const [open, setOpen] = useState(false)
  const [isAdmin] = useState<boolean>(true)

  // const ApprenticeLinks: Array<ApprenticeLink> = [
  //   {
  //     title: "Home",
  //     path: "",
  //     icon: <AiOutlineHome />,
  //   } as ApprenticeLink,
  //   {
  //     title: "Induction",
  //     path: "induction",
  //     icon: <MdOutlineVideoLibrary />,
  //   } as ApprenticeLink,
  // ];

  return (
    <>
      {isAdmin && (
        <aside
          onMouseOver={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          id="sidebar"
          className={`flex flex-col py-2 pl-2  h-[100dvh] ${
            open ? 'w-[250px] sm:w-48' : 'w-16'
          } bg-black relative transition-all duration-100 overflow-y-auto overflow-x-hidden`}
        >
          <div
            className={'text-white flex items-center gap-x-1 py-2 rounded mr-2 text-decoration-none'}
          >
            <div className="w-10 h-10 float-left bg-[url('./assets/sidebar-logo.png')] bg-contain bg-no-repeat"></div>
            <span
              className={`absolute text-base font-semibold duration-200 text-md transition-all py-2  ${
                open ? 'translate-x-11 block' : 'scale-0'
              }`}
            >
              CETB
            </span>
          </div>
          <ul className={'pl-0 mt-10 flex flex-col h-full gap-3'}>
            {true && (
              <>
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
                    className={`font-semibold duration-200 text-sm sm:text-base transition-all -translate-x-12  ${
                      open ? 'translate-x-0 block ' : 'scale-0'
                    }`}
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
                    className={`text-sm sm:text-base font-semibold duration-200 transition-all -translate-x-12  ${
                      open ? 'translate-x-0 block' : 'scale-0'
                    }`}
                  >
                    Admins
                  </span>
                </Link>
              </>
            )}
            <li
              className={'flex sm:hidden mt-auto text-white text-xl  items-center gap-x-2 cursor-pointer p-2 hover:bg-white hover:text-black rounded mr-2 text-decoration-none'}
            >
              <span className="text-2xl font-extrabold float-left">
                <LogOut size={30} />
              </span>
              <span
                className={`font-semibold duration-200 text-sm transition-all -translate-x-12  ${
                  open ? 'translate-x-0 block' : 'scale-0'
                }`}
              >
                Logout
              </span>
            </li>
          </ul>
        </aside>
      )}
    </>
  )
}

export default SideBar
