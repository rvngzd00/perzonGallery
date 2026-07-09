/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

interface AdminUser {
  id: string
  email: string
}

interface AdminSession {
  user: AdminUser
  createdAt: string
}

interface AuthContextValue {
  user: AdminUser | null
  session: AdminSession | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const ADMIN_SESSION_KEY = 'perzon-admin-session'
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? 'admin@perzon.local'
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'admin123'

const AuthContext = createContext<AuthContextValue | null>(null)

function readSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY)
    return raw ? (JSON.parse(raw) as AdminSession) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSession(readSession())
    setLoading(false)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      signIn: async (email, password) => {
        if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
          throw new Error('Invalid email or password.')
        }

        const nextSession: AdminSession = {
          user: { id: 'local-admin', email },
          createdAt: new Date().toISOString(),
        }
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(nextSession))
        setSession(nextSession)
      },
      signOut: async () => {
        localStorage.removeItem(ADMIN_SESSION_KEY)
        setSession(null)
      },
    }),
    [session, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
