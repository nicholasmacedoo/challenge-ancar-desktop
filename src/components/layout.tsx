import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/Auth'

export function LayoutDashboard() {
  const { user } = useAuth()

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  )
}