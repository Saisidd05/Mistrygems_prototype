import React from 'react'
import { Sidebar } from '../layout/Sidebar'
import { Topbar } from '../layout/Topbar'
import { AnimatedBackground } from '../ui/AnimatedBackground'
import { SidebarProvider } from '../../context/SidebarContext'

export function IndustryLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AnimatedBackground />
      <div className="app-container">
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

