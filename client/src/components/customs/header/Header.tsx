// import {queryClient} from "@/App";
import { Button } from '@/components/ui/button'
import { useLogout } from '@/hooks/login/useLogout'
import { AuthModel } from '@/schemas/types/AccountModel'
import { useQueryClient } from '@tanstack/react-query'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
// import { useNavigate } from 'react-router-dom'

const Header = () => {
  const { mutateAsync } = useLogout()
  const navigate = useNavigate()
  const user = useQueryClient().getQueryData<AuthModel>(['auth'])?.name.split(' ')
  const username = `${user?.[0]} ${user?.length !== undefined && user?.length > 1 ? user?.[user.length - 1] : ''}`

  const handleLogout = () => {
    const promise = mutateAsync()
    toast.promise(promise, {
      loading: 'Logging out...',
      success: () => {
        navigate('/')
        return 'You are logged out!'
      },
      error: () => {
        return 'Error while logging out'
      }
    })
  }

  return (
    <nav className="bg-black">
      <div className="px-2">
        <div className="relative flex h-20 ">
          <div className="flex flex-1 items-center">
            <div className="flex justify-between items-center w-full px-2 ">
              <p className="text-sm sm:text-base text-white hover:text-white rounded-md  mx-10 p-2 font-medium">
                {username}
              </p>
              <Button
                variant={'secondary'}
                className='flex items-center gap-1 '
                onClick={handleLogout}
              >
                <LogOut size={20}/> Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header
