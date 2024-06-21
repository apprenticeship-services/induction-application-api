import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import router from './routes/route'
import { Toaster, toast } from 'sonner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
      refetchOnWindowFocus: 'always'
    }
  },
  queryCache: new QueryCache({
    onError: (_error, query) => {
      if (query?.meta?.errorMessage) {
        toast.error(query.meta.errorMessage as string)
      }
    }
  })
})

function App () {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RouterProvider router={router} />
      <Toaster theme='dark'/>
    </QueryClientProvider>
  )
}

export default App
