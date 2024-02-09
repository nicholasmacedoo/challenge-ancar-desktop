import { ReactNode } from 'react'
import { AuthProvider } from './Auth'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from '@/components/ui/toaster'

export const queryClient = new QueryClient()

interface AppProvidersProps {
  children: ReactNode
}
export function AppProvider({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      <Toaster />
    </AuthProvider>
  )
}
