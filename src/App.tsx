import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ThemeProvider } from '@/context/ThemeContext';
import { SidebarProvider } from '@/context/SidebarContext';

const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Jobs = React.lazy(() => import('@/pages/Jobs'));
const Quotations = React.lazy(() => import('@/pages/Quotations'));
const Customers = React.lazy(() => import('@/pages/Customers'));
const Employees = React.lazy(() => import('@/pages/Employees'));
const Tasks = React.lazy(() => import('@/pages/Tasks'));
const Reports = React.lazy(() => import('@/pages/Reports'));
const Notifications = React.lazy(() => import('@/pages/Notifications'));
const Settings = React.lazy(() => import('@/pages/Settings'));

function PageLoader() {
  return <div className="skeleton h-72 rounded-[22px]" aria-label="Loading page" />;
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <Router>
          <Layout>
            <React.Suspense fallback={<PageLoader />}>
              <Routes>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/quotations" element={<Quotations />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              </Routes>
            </React.Suspense>
          </Layout>
        </Router>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default App;
