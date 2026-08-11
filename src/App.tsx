import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, getAccountType, getDashboardPath, useAuth } from './context/AuthContext'
import { AppDataProvider } from './context/AppDataContext'
import { IndustryDataProvider } from './context/IndustryDataContext'
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
import { IndustryLayout } from './components/industry/IndustryLayout'
import { IndustryDashboard, IndustryRequirements, IndustrySection } from './pages/industry/IndustryDashboard'

function RoleProtectedRoute({ accountType, children }: { accountType: 'workshop' | 'industry'; children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }
  if (getAccountType(user) !== accountType) return <Navigate to={getDashboardPath(user)} replace />
  return accountType === 'workshop' ? <Layout>{children}</Layout> : <IndustryLayout>{children}</IndustryLayout>
}

function LegacyWorkshopRedirect({ path }: { path: string }) {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />
  return <Navigate to={getAccountType(user) === 'workshop' ? `/workshop/${path}` : getDashboardPath(user)} replace />
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppDataProvider>
          <IndustryDataProvider>
          <ToastProvider>
            <BrowserRouter>
              <CustomCursor />
              <Routes>
                {/* Public Landing & Login */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/complete-profile" element={<ProfileCompletion />} />

                {/* Workshop routes: existing operational features, isolated from Industry users. */}
                <Route path="/workshop/dashboard" element={<RoleProtectedRoute accountType="workshop"><Dashboard /></RoleProtectedRoute>} />
                <Route path="/workshop/feed" element={<RoleProtectedRoute accountType="workshop"><Notifications /></RoleProtectedRoute>} />
                <Route path="/workshop/jobs" element={<RoleProtectedRoute accountType="workshop"><Jobs /></RoleProtectedRoute>} />
                <Route path="/workshop/customers" element={<RoleProtectedRoute accountType="workshop"><Customers /></RoleProtectedRoute>} />
                <Route path="/workshop/employees" element={<RoleProtectedRoute accountType="workshop"><Employees /></RoleProtectedRoute>} />
                <Route path="/workshop/tasks" element={<RoleProtectedRoute accountType="workshop"><Tasks /></RoleProtectedRoute>} />
                <Route path="/workshop/quotations" element={<RoleProtectedRoute accountType="workshop"><Quotations /></RoleProtectedRoute>} />
                <Route path="/workshop/invoices" element={<RoleProtectedRoute accountType="workshop"><Invoices /></RoleProtectedRoute>} />
                <Route path="/workshop/inventory" element={<RoleProtectedRoute accountType="workshop"><Inventory /></RoleProtectedRoute>} />
                <Route path="/workshop/notifications" element={<RoleProtectedRoute accountType="workshop"><Notifications /></RoleProtectedRoute>} />
                <Route path="/workshop/reports" element={<RoleProtectedRoute accountType="workshop"><Reports /></RoleProtectedRoute>} />
                <Route path="/workshop/settings" element={<RoleProtectedRoute accountType="workshop"><Settings /></RoleProtectedRoute>} />

                {/* Industry routes: dedicated layout, navigation and pages. */}
                <Route path="/industry/dashboard" element={<RoleProtectedRoute accountType="industry"><IndustryDashboard /></RoleProtectedRoute>} />
                <Route path="/industry/requirements" element={<RoleProtectedRoute accountType="industry"><IndustryRequirements /></RoleProtectedRoute>} />
                <Route path="/industry/requirements/new" element={<RoleProtectedRoute accountType="industry"><IndustryRequirements createMode /></RoleProtectedRoute>} />
                <Route path="/industry/vendor-matching" element={<RoleProtectedRoute accountType="industry"><IndustrySection title="Vendor Matching" description="Match workshops by capability, services, certifications, location and capacity." /></RoleProtectedRoute>} />
                <Route path="/industry/quotations" element={<RoleProtectedRoute accountType="industry"><IndustrySection title="Quotations" description="Compare received quotations by price, delivery time and workshop rating." /></RoleProtectedRoute>} />
                <Route path="/industry/vendors" element={<RoleProtectedRoute accountType="industry"><IndustrySection title="Vendor Management" description="Manage approved vendors for your company." /></RoleProtectedRoute>} />
                <Route path="/industry/purchase-orders" element={<RoleProtectedRoute accountType="industry"><IndustrySection title="Purchase Orders" description="Create and monitor industry purchase orders." /></RoleProtectedRoute>} />
                <Route path="/industry/production-tracking" element={<RoleProtectedRoute accountType="industry"><IndustrySection title="Production Tracking" description="Track acceptance, production, inspection and dispatch updates." /></RoleProtectedRoute>} />
                <Route path="/industry/quality-check" element={<RoleProtectedRoute accountType="industry"><IndustrySection title="Quality Check Status" description="Review inspection reports, approvals and rework requests." /></RoleProtectedRoute>} />
                <Route path="/industry/delivery-tracking" element={<RoleProtectedRoute accountType="industry"><IndustrySection title="Delivery Tracking" description="Monitor dispatch, transport, tracking and delivery confirmation." /></RoleProtectedRoute>} />
                <Route path="/industry/notifications" element={<RoleProtectedRoute accountType="industry"><IndustrySection title="Notifications" description="Stay informed about quotes, production, quality and delivery updates." /></RoleProtectedRoute>} />
                <Route path="/industry/company-profile" element={<RoleProtectedRoute accountType="industry"><IndustrySection title="Company Profile" description="Manage your company details, GST number, contacts and business description." /></RoleProtectedRoute>} />
                <Route path="/industry/settings" element={<RoleProtectedRoute accountType="industry"><IndustrySection title="Settings" description="Configure your industry portal preferences." /></RoleProtectedRoute>} />

                {/* Preserve existing workshop bookmarks without exposing them to Industry accounts. */}
                <Route path="/dashboard" element={<LegacyWorkshopRedirect path="dashboard" />} />
                <Route path="/feed" element={<LegacyWorkshopRedirect path="feed" />} />
                <Route path="/jobs" element={<LegacyWorkshopRedirect path="jobs" />} />
                <Route path="/customers" element={<LegacyWorkshopRedirect path="customers" />} />
                <Route path="/employees" element={<LegacyWorkshopRedirect path="employees" />} />
                <Route path="/tasks" element={<LegacyWorkshopRedirect path="tasks" />} />
                <Route path="/quotations" element={<LegacyWorkshopRedirect path="quotations" />} />
                <Route path="/invoices" element={<LegacyWorkshopRedirect path="invoices" />} />
                <Route path="/inventory" element={<LegacyWorkshopRedirect path="inventory" />} />
                <Route path="/notifications" element={<LegacyWorkshopRedirect path="notifications" />} />
                <Route path="/reports" element={<LegacyWorkshopRedirect path="reports" />} />
                <Route path="/settings" element={<LegacyWorkshopRedirect path="settings" />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </ToastProvider>
          </IndustryDataProvider>
        </AppDataProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
