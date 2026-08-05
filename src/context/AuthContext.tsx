import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { seedUsers, type UserAccount } from '../lib/data'

interface AuthContextType {
  user: UserAccount | null
  login: (username: string, password: string) => boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_KEY = 'mg_auth_user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  // Ensure seed users exist in localStorage
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('mg_users') || 'null')
    if (!users) {
      localStorage.setItem('mg_users', JSON.stringify(seedUsers))
    }
  }, [])

  const login = useCallback((username: string, password: string): boolean => {
    const users: UserAccount[] = JSON.parse(localStorage.getItem('mg_users') || JSON.stringify(seedUsers))
    const found = users.find(u => u.username === username && u.password === password)
    if (found) {
      setUser(found)
      localStorage.setItem(AUTH_KEY, JSON.stringify(found))
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(AUTH_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
