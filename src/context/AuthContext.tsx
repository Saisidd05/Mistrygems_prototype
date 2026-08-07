import React, { createContext, useContext, useState, useCallback } from 'react'

export interface User {
  id: string
  name: string
  username: string
  email: string
  workshopName: string
  workshopAddress: string
  gstin?: string
  avatar: string
  role: string
  accountType?: 'workshop' | 'industry'
  authProvider: 'local' | 'google'
  googleId?: string
  profileImage?: string
}

export type AccountType = 'workshop' | 'industry'

export const getAccountType = (user: Pick<User, 'accountType' | 'role'> | null | undefined): AccountType =>
  user?.accountType === 'industry' || user?.role?.toLowerCase().includes('industry') ? 'industry' : 'workshop'

export const getDashboardPath = (user: Pick<User, 'accountType' | 'role'> | null | undefined) =>
  getAccountType(user) === 'industry' ? '/industry/dashboard' : '/workshop/dashboard'

export interface SignupData {
  name: string
  username: string
  email: string
  workshopName: string
  workshopAddress: string
  password: string
  accountType?: 'workshop' | 'industry'
}

export interface GoogleProfileData {
  credential: string
  googleId: string
  email: string
  name: string
  profileImage?: string
  username: string
  workshopName: string
  workshopAddress: string
  accountType?: 'workshop' | 'industry'
}

export interface GoogleDetails {
  credential: string
  googleId: string
  email: string
  name: string
  profileImage?: string
  accountType?: 'workshop' | 'industry'
}

interface AuthApiResponse {
  token?: string
  user?: User
  isNewUser?: boolean
  googleId?: string
  email?: string
  name?: string
  profileImage?: string
  error?: string
}

interface AuthContextType {
  user: User | null
  login: (usernameOrEmail: string, password: string, accountType?: AccountType) => Promise<{ success: boolean; redirectTo?: string; error?: string }>
  signup: (userData: SignupData) => Promise<{ success: boolean; redirectTo?: string; error?: string }>
  loginWithGoogle: (credential: string, accountType?: AccountType) => Promise<{ success: boolean; redirectTo?: string; isNewUser?: boolean; googleDetails?: GoogleDetails; error?: string }>
  completeGoogleProfile: (profileData: GoogleProfileData) => Promise<{ success: boolean; redirectTo?: string; error?: string }>
  updateProfile: (profileData: Pick<User, 'workshopName' | 'workshopAddress' | 'gstin'>) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_KEY = 'mistry-auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed?.user || null
      }
      return null
    } catch {
      return null
    }
  })

  const login = useCallback(async (usernameOrEmail: string, password: string, accountType: 'workshop' | 'industry' = 'workshop') => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', username: usernameOrEmail, password, accountType }),
      })
      const result = await response.json() as AuthApiResponse
      if (!response.ok) {
        return { success: false, error: result.error || 'Invalid credentials.' }
      }
      if (!result.token || !result.user) {
        return { success: false, error: 'Authentication service returned an invalid response.' }
      }

      const sessionData = {
        token: result.token,
        user: result.user,
        id: result.user.id
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData))
      setUser(result.user)
      return { success: true, redirectTo: getDashboardPath(result.user) }
    } catch (err: unknown) {
      console.error('Login error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Authentication service is unavailable.' }
    }
  }, [])

  const signup = useCallback(async (userData: SignupData) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signup', ...userData }),
      })
      const result = await response.json() as AuthApiResponse
      if (!response.ok) {
        return { success: false, error: result.error || 'Unable to create account.' }
      }
      if (!result.token || !result.user) {
        return { success: false, error: 'Authentication service returned an invalid response.' }
      }

      const sessionData = {
        token: result.token,
        user: result.user,
        id: result.user.id
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData))
      setUser(result.user)
      return { success: true, redirectTo: getDashboardPath(result.user) }
    } catch (err: unknown) {
      console.error('Signup error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Authentication service is unavailable.' }
    }
  }, [])

  const loginWithGoogle = useCallback(async (credential: string, accountType: 'workshop' | 'industry' = 'workshop') => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'google', credential, accountType }),
      })
      const result = await response.json() as AuthApiResponse
      if (!response.ok) {
        return { success: false, error: result.error || 'Google sign-in failed.' }
      }

      if (result.isNewUser && result.googleId && result.email && result.name !== undefined) {
        return {
          success: true,
          isNewUser: true,
          googleDetails: {
            credential,
            googleId: result.googleId,
            email: result.email,
            name: result.name,
            profileImage: result.profileImage,
            accountType,
          }
        }
      }
      if (!result.token || !result.user) {
        return { success: false, error: 'Authentication service returned an invalid response.' }
      }

      const sessionData = {
        token: result.token,
        user: result.user,
        id: result.user.id
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData))
      setUser(result.user)
      return { success: true, redirectTo: getDashboardPath(result.user) }
    } catch (err: unknown) {
      console.error('Google login error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Google authentication is currently unavailable.' }
    }
  }, [])

  const completeGoogleProfile = useCallback(async (profileData: GoogleProfileData) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete-profile', ...profileData }),
      })
      const result = await response.json() as AuthApiResponse
      if (!response.ok) {
        return { success: false, error: result.error || 'Unable to complete profile registration.' }
      }
      if (!result.token || !result.user) {
        return { success: false, error: 'Authentication service returned an invalid response.' }
      }

      const sessionData = {
        token: result.token,
        user: result.user,
        id: result.user.id
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData))
      setUser(result.user)
      return { success: true, redirectTo: getDashboardPath(result.user) }
    } catch (err: unknown) {
      console.error('Complete profile error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Profile completion service failed.' }
    }
  }, [])

  const updateProfile = useCallback(async (profileData: Pick<User, 'workshopName' | 'workshopAddress' | 'gstin'>) => {
    try {
      const saved = localStorage.getItem(AUTH_KEY)
      const token = saved ? JSON.parse(saved)?.token : undefined
      const response = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token || ''}` }, body: JSON.stringify({ action: 'update-profile', ...profileData }) })
      const result = await response.json() as AuthApiResponse
      if (!response.ok || !result.user) return { success: false, error: result.error || 'Unable to update workshop profile.' }
      const sessionData = { token, user: result.user, id: result.user.id }
      localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData)); setUser(result.user)
      return { success: true }
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Unable to update workshop profile.' }
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(AUTH_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      loginWithGoogle,
      completeGoogleProfile,
      updateProfile,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
