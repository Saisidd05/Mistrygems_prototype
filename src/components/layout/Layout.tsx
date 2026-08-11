import React from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { AnimatedBackground } from '../ui/AnimatedBackground'
import { SidebarProvider } from '../../context/SidebarContext'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
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
