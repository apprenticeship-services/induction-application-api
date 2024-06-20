import LoginForm from '@/components/customs/forms/login/LoginForm'
import HeroImage from '@/assets/hero.png'
import { ArrowRight } from 'lucide-react'
import { LoginModal } from '@/components/customs/modals/LoginModal'

export const Login = () => {
  return (
    <section id="login" className='login-bg w-dvw h-dvh flex items-center justify-center overflow-y-scroll'>
      {/* Desktop Landing Page */}
      <div className='hidden sm:flex rounded-sm shadow-2xl mx-2 my-4'>
        <div className='bg-slate-900 w-full flex justify-center'>
          <div className='w-full text-white flex-initial flex justify-center flex-col items-center p-5'>
            <h1 className='text-xl md:text-2xl text-center font-bold tracking-wider'>Start Your Journey Here</h1>
            <div className='flex flex-col gap-3 lg:items-center p-4'>
              <p className='flex items-center gap-2 text-sm'><ArrowRight className='inline-block' size={12}/>Watch your induction video from anywhere.</p>
              <p className='flex items-center gap-2 text-sm'><ArrowRight className='inline-block' size={12}/>Complete your short assessment.</p>
              <p className='flex items-center gap-2 text-sm'><ArrowRight className='inline-block' size={12}/>Get ready for your next apprenticeship step.</p>
            </div>
            <img src={HeroImage} alt="Hero image" className='w-[500px]' />
            <p className='text-xs italic text-center'>Bishopstown Campus Apprenticeship Services</p>
          </div>
        </div>
        <div className='bg-white flex-auto flex items-center px-5 justify-center md:min-w-[350px]'>
          <LoginForm/>
        </div>
      </div>

      {/* Mobile Landing Page */}
      <div className='flex sm:hidden flex-col rounded shadow-2xl mx-1'>
        <div className='bg-slate-900 rounded w-full flex justify-center'>
          <div className='w-full text-white flex-initial flex flex-col items-center p-5 gap-3'>
            <h1 className='text-2xl text-center font-bold tracking-wider'>Start Your Journey Here</h1>
            <div className='flex flex-col gap-3 lg:items-center'>
              <p className='flex items-center gap-2 text-sm'><ArrowRight className='inline-block' size={12}/>Watch your induction video from anywhere.</p>
              <p className='flex items-center gap-2 text-sm'><ArrowRight className='inline-block' size={12}/>Complete your short assessment.</p>
              <p className='flex items-center gap-2 text-sm'><ArrowRight className='inline-block' size={12}/>Get ready for your next apprenticeship step.</p>
            </div>
            <img src={HeroImage} alt="Hero image" className='w-[500px] relative left-[-10px]' />
            <div className='w-[75%]'>
              <LoginModal/>
            </div>
            <p className='text-xs italic text-center pt-4'>Bishopstown Campus Apprenticeship Services</p>
          </div>
        </div>
      </div>
        </section>
  )
}
