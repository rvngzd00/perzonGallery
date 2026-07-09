import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export function ProtectedRoute({
  children,
  redirectTo = '/',
}: {
  children: ReactNode
  redirectTo?: string
}) {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to={redirectTo} replace />

  return <>{children}</>
}
