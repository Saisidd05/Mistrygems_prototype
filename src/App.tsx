import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { ThemeProvider } from '@/context/ThemeContext'
import { SidebarProvider } from '@/context/SidebarContext'
import { AuthProvider, useAuth } from '@/context/AuthContext'

// Lazy load all pages
const Login = React.lazy(() => import('@/pages/Login'))
const Signup = React.lazy(() => import('@/pages/Signup'))
const Dashboard = React.lazy(() => import('@/pages/Dashboard'))
const Jobs = React.lazy(() => import('@/pages/Jobs'))
const Quotations = React.lazy(() => import('@/pages/Quotations'))
const Customers = React.lazy(() => import('@/pages/Customers'))
const Employees = React.lazy(() => import('@/pages/Employees'))
const AddEmployee = React.lazy(() => import('@/pages/AddEmployee'))
const Tasks = React.lazy(() => import('@/pages/Tasks'))
const Reports = React.lazy(() => import('@/pages/Reports'))
const Notifications = React.lazy(() => import('@/pages/Notifications'))
const Settings = React.lazy(() => import('@/pages/Settings'))
const Inventory = React.lazy(() => import('@/pages/Inventory'))
const Invoices = React.lazy(() => import('@/pages/Invoices'))

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
        <span className="text-sm text-slate-400 font-medium">Loading…</span>
      </div>
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Suspense fallback={<LoadingSpinner />}>
              <Login />
            </Suspense>
          )
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Suspense fallback={<LoadingSpinner />}>
              <Signup />
            </Suspense>
          )
        }
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/quotations" element={<Quotations />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/employees/add" element={<AddEmployee />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Suspense>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SidebarProvider>
          <Router>
            <AppRoutes />
          </Router>
        </SidebarProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
