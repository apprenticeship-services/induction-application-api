import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import router from './routes/route'
import { Toaster } from 'sonner'

const queryClient = new QueryClient()
console.log('0462641')
console.log('apprenticeshipservices.cetb@gmail.com')

function App () {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster theme='dark'/>
    </QueryClientProvider>
  )
}

export default App
