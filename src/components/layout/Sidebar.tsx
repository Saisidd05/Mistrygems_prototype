import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, Users, ClipboardList, X,
  FileText, BarChart2, LogOut, Package, Receipt, Rss,
  Truck, FileCheck, MapPin, UserCircle, Building2, MessageCircle
} from 'lucide-react'
import { getAccountType, useAuth } from '../../context/AuthContext'
import { useSidebar } from '../../context/SidebarContext'
import { cn } from '../../lib/utils'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
  badge?: number
  roles?: string[]
}

const workshopNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/workshop/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Industry Feed', path: '/workshop/feed', icon: <Rss size={18} /> },
  { label: 'Jobs', path: '/workshop/jobs', icon: <Briefcase size={18} /> },
  { label: 'Customers', path: '/workshop/customers', icon: <Users size={18} /> },
  { label: 'Quotations', path: '/workshop/quotations', icon: <FileText size={18} /> },
  { label: 'Invoices', path: '/workshop/invoices', icon: <Receipt size={18} /> },
  { label: 'Inventory', path: '/workshop/inventory', icon: <Package size={18} /> },
  { label: 'Reports', path: '/workshop/reports', icon: <BarChart2 size={18} />, roles: ['Owner', 'Manager'] },
  { label: 'Industry Chats', path: '/workshop/chats', icon: <MessageCircle size={18} /> },
]

const industryNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/industry/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'My Requirements', path: '/industry/requirements', icon: <ClipboardList size={18} /> },
  { label: 'Quotations', path: '/industry/quotations', icon: <FileText size={18} /> },
  { label: 'Purchase Orders', path: '/industry/purchase-orders', icon: <Receipt size={18} /> },
  { label: 'Production Tracking', path: '/industry/production-tracking', icon: <Truck size={18} /> },
  { label: 'Quality Check', path: '/industry/quality-check', icon: <FileCheck size={18} /> },
  { label: 'Delivery Tracking', path: '/industry/delivery-tracking', icon: <MapPin size={18} /> },
  { label: 'Registered Workshops', path: '/industry/vendors', icon: <Building2 size={18} /> },
  { label: 'Workshop Chats', path: '/industry/chats', icon: <MessageCircle size={18} /> },
  { label: 'Company Profile', path: '/industry/company-profile', icon: <UserCircle size={18} /> },
]

export function Sidebar() {
  const location = useLocation()
  const { collapsed, mobileOpen, closeMobile } = useSidebar()
  const [desktop, setDesktop] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches)
  const [dockOpen, setDockOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const isIndustry = getAccountType(user) === 'industry' || location.pathname.startsWith('/industry')
  const navItems = isIndustry ? industryNavItems : workshopNavItems

  const handleLogout = () => {
    closeMobile()
    logout()
    navigate('/login')
  }

  const handleBrandClick = () => {
    closeMobile()
    navigate(isIndustry ? '/industry/dashboard' : '/workshop/dashboard')
  }

  const revealDock = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = null
    setDockOpen(true)
  }

  const queueClose = () => {
    if (!desktop) return
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setDockOpen(false), 500)
  }

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px) and (pointer: fine)')
    const updateMode = () => {
      setDesktop(media.matches)
      if (!media.matches) setDockOpen(true)
      if (media.matches) setDockOpen(false)
    }
    const revealAtEdge = (event: MouseEvent) => {
      if (media.matches && event.clientX <= 28) revealDock()
    }
    updateMode()
    media.addEventListener('change', updateMode)
    window.addEventListener('mousemove', revealAtEdge, { passive: true })
    return () => {
      media.removeEventListener('change', updateMode)
      window.removeEventListener('mousemove', revealAtEdge)
      if (closeTimer.current) window.clearTimeout(closeTimer.current)
    }
  }, [])

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[#03045E]/75 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
          aria-label="Close navigation menu"
        />
      )}
      <div
        className="sidebar-edge-trigger"
        onMouseEnter={revealDock}
        onMouseLeave={queueClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 h-[100dvh] w-72 flex-col border-r border-glass/10 glass-surface transition-all duration-300',
          mobileOpen ? '!flex !translate-x-0 shadow-2xl' : 'hidden -translate-x-full',
          'lg:fixed lg:flex lg:top-0 lg:left-0 lg:w-[264px] lg:transition-[transform,opacity,box-shadow] lg:duration-[360ms] lg:ease-in-out lg:will-change-transform',
          collapsed ? 'w-16' : 'w-60'
        )}
        style={desktop ? { transform: dockOpen ? 'translate3d(0,0,0)' : 'translate3d(-100%,0,0)', opacity: dockOpen ? 1 : 0, boxShadow: dockOpen ? '0 0 34px rgba(0,180,216,.32)' : 'none' } : undefined}
        onMouseEnter={revealDock}
        onMouseLeave={queueClose}
      >
        {/* Logo */}
        <button
          type="button"
          onClick={handleBrandClick}
          className={cn('flex w-full items-center gap-3 px-4 py-5 border-b border-glass/10 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent', collapsed && 'justify-center px-2')}
          aria-label={isIndustry ? 'Go to industry dashboard' : 'Go to workshop dashboard'}
        >
          <img src="/logo-icon.png" alt="Mistry Gems" className="w-9 h-9 object-contain flex-shrink-0" />
          {!collapsed && (
            <div>
              <p className="text-sm font-bold font-sora gradient-text-bright leading-tight">Mistry Gems</p>
              <p className="text-[10px] text-glass-dim">{isIndustry ? 'Industry Portal' : 'Workflow Platform'}</p>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={closeMobile}
          className="absolute right-3 top-4 rounded-lg p-2 text-glass-dim hover:bg-white/10 hover:text-highlight lg:hidden"
          aria-label="Close navigation menu"
        >
          <X size={18} />
        </button>

        {/* User Info */}
        {!collapsed && user && (
          <div className="px-4 py-3 border-b border-glass/10">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 bg-gradient-to-br from-[#0077B6] to-[#00B4D8] overflow-hidden">
                {user.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('/')) ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.avatar
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-highlight truncate">{user.name}</p>
                <p className="text-[10px] text-glass-dim truncate">{isIndustry ? (user.workshopName || 'Industry Account') : user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-3 px-2 space-y-0.5">
          {navItems.map(item => {
            if (item.roles && user && !item.roles.includes(user.role)) return null
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobile}
                className={({ isActive }) => cn('sidebar-item', isActive && 'active')}
                title={collapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate text-sm">{item.label}</span>}
              </NavLink>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-glass/10">
          <button
            onClick={handleLogout}
            className={cn('sidebar-item w-full text-red-400/70 hover:text-red-400 hover:bg-red-500/10', collapsed && 'justify-center')}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

      </aside>
    </>
  )
}

