import React, { createContext, useContext, useState } from 'react'

export interface User {
  id: string
  username: string
  name: string
  role: 'Admin' | 'Employee'
  avatar: string
  email: string
}

interface StoredUser extends User {
  password: string
}

const SEED_USERS: StoredUser[] = [
  { id: 'USR-001', username: 'admin', password: 'mistry123', name: 'Sai Mistry', role: 'Admin', avatar: 'SM', email: 'admin@mistrygems.com' },
  { id: 'USR-002', username: 'ramesh', password: 'pass123', name: 'Ramesh Kumar', role: 'Employee', avatar: 'RK', email: 'ramesh.kumar@mistrygems.com' },
  { id: 'USR-003', username: 'sunita', password: 'pass123', name: 'Sunita Mehta', role: 'Employee', avatar: 'SU', email: 'sunita.mehta@mistrygems.com' },
]

const USERS_KEY = 'mg_users'
const SESSION_KEY = 'mg_session'

function getUsers(): StoredUser[] {
  try {
    const stored = localStorage.getItem(USERS_KEY)
    if (!stored) {
      localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS))
      return SEED_USERS
    }
    return JSON.parse(stored)
  } catch {
    return SEED_USERS
  }
}

interface AuthContextType {
  currentUser: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const session = localStorage.getItem(SESSION_KEY)
      return session ? JSON.parse(session) : null
    } catch {
      return null
    }
  })

  const login = (username: string, password: string): boolean => {
    const users = getUsers()
    const found = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    )
    if (found) {
      const { password: _p, ...user } = found
      setCurrentUser(user)
      localStorage.setItem(SESSION_KEY, JSON.stringify(user))
      return true
    }
    return false
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem(SESSION_KEY)
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
