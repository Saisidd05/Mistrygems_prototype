import { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'owner' | 'manager' | 'employee' | 'client'

interface AuthState {
  isAuthenticated: boolean
  userRole: UserRole | null
  userName: string
  userEmail: string
}

interface AuthContextType extends AuthState {
  login: (role: UserRole, email: string, name: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: null,
  userName: '',
  userEmail: '',
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('mistry-auth')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return { isAuthenticated: false, userRole: null, userName: '', userEmail: '' }
      }
    }
    return { isAuthenticated: false, userRole: null, userName: '', userEmail: '' }
  })

  useEffect(() => {
    localStorage.setItem('mistry-auth', JSON.stringify(auth))
  }, [auth])

  const login = (role: UserRole, email: string, name: string) => {
    setAuth({
      isAuthenticated: true,
      userRole: role,
      userName: name,
      userEmail: email,
    })
  }

  const logout = () => {
    setAuth({ isAuthenticated: false, userRole: null, userName: '', userEmail: '' })
    localStorage.removeItem('mistry-auth')
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
