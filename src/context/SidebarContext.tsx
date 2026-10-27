import React, { createContext, useContext, useState } from 'react'

interface SidebarContextType {
  collapsed: boolean
  mobileOpen: boolean
  toggle: () => void
  closeMobile: () => void
  setCollapsed: (v: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isMobileLayout = () => typeof window !== 'undefined' && window.innerWidth < 1024
  const toggle = () => {
    if (isMobileLayout()) setMobileOpen(open => !open)
    else setCollapsed(collapsed => !collapsed)
  }
  const closeMobile = () => setMobileOpen(false)

  return (
    <SidebarContext.Provider value={{ collapsed, mobileOpen, toggle, closeMobile, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used inside SidebarProvider')
  return ctx
}
