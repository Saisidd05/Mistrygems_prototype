import { createContext, useContext, useEffect, useState } from 'react'

export type UserRole = 'owner' | 'manager' | 'employee' | 'client'

interface AuthState {
  isAuthenticated: boolean
  userRole: UserRole | null
  userName: string
  userEmail: string
  userId?: string
}

interface AuthContextType extends AuthState {
  login: (role: UserRole, email: string, name: string, id?: string) => void
  logout: () => void
}

const defaultAuthState: AuthState = {
  isAuthenticated: false,
  userRole: null,
  userName: '',
  userEmail: '',
}

const AuthContext = createContext<AuthContextType>({
  ...defaultAuthState,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('mistry-auth')
    if (!saved) return defaultAuthState

    try {
      return { ...defaultAuthState, ...JSON.parse(saved) }
    } catch {
      return defaultAuthState
    }
  })

  useEffect(() => {
    localStorage.setItem('mistry-auth', JSON.stringify(auth))
  }, [auth])

  const login = (role: UserRole, email: string, name: string, id?: string) => {
    const next = {
      isAuthenticated: true,
      userRole: role,
      userName: name,
      userEmail: email,
      userId: id,
    }
    setAuth(next)
  }

  const logout = () => {
    setAuth(defaultAuthState)
    localStorage.removeItem('mistry-auth')
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
