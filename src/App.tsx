import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppDataProvider } from './context/AppDataContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './components/ui/Toast'
import { Layout } from './components/layout/Layout'
import { CustomCursor } from './components/ui/CustomCursor'

import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import Signup from './pages/Signup'
import { ProfileCompletion } from './pages/ProfileCompletion'
import { Dashboard } from './pages/Dashboard'
import { Jobs } from './pages/Jobs'
import { Customers } from './pages/Customers'
import { Employees } from './pages/Employees'
import { Tasks } from './pages/Tasks'
import { Quotations } from './pages/Quotations'
import { Invoices } from './pages/Invoices'
import { Inventory } from './pages/Inventory'
import { Notifications } from './pages/Notifications'
import { Reports } from './pages/Reports'
import { Settings } from './pages/Settings'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <Layout>{children}</Layout>
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppDataProvider>
          <ToastProvider>
            <BrowserRouter>
              <CustomCursor />
              <Routes>
                {/* Public Landing & Login */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/complete-profile" element={<ProfileCompletion />} />

                {/* Protected Dashboard Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
                <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
                <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
                <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
                <Route path="/quotations" element={<ProtectedRoute><Quotations /></ProtectedRoute>} />
                <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </AppDataProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
