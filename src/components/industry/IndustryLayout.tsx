import React from 'react'
import { Sidebar } from '../layout/Sidebar'
import { Topbar } from '../layout/Topbar'
import { SidebarProvider } from '../../context/SidebarContext'

export function IndustryLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="internal-theme app-container">
        <Sidebar />
        <div className="main-content">
          <Topbar />
          <main className="page-content">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
