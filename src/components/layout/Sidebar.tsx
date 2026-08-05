import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, Users, UserCheck, ClipboardList,
  FileText, Bell, BarChart2, Settings, LogOut, ChevronLeft,
  ChevronRight, Gem, Package, Receipt
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useSidebar } from '../../context/SidebarContext'
import { useAppData } from '../../context/AppDataContext'
import { cn } from '../../lib/utils'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
  badge?: number
  roles?: string[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Jobs', path: '/jobs', icon: <Briefcase size={18} /> },
  { label: 'Customers', path: '/customers', icon: <Users size={18} /> },
  { label: 'Employees', path: '/employees', icon: <UserCheck size={18} /> },
  { label: 'Tasks', path: '/tasks', icon: <ClipboardList size={18} /> },
  { label: 'Quotations', path: '/quotations', icon: <FileText size={18} /> },
  { label: 'Invoices', path: '/invoices', icon: <Receipt size={18} /> },
  { label: 'Inventory', path: '/inventory', icon: <Package size={18} /> },
  { label: 'Reports', path: '/reports', icon: <BarChart2 size={18} />, roles: ['Owner', 'Manager'] },
  { label: 'Notifications', path: '/notifications', icon: <Bell size={18} /> },
  { label: 'Settings', path: '/settings', icon: <Settings size={18} /> },
]

export function Sidebar() {
  const { collapsed, toggle } = useSidebar()
  const [desktop, setDesktop] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches)
  const [dockOpen, setDockOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { user, logout } = useAuth()
  const { notifications } = useAppData()
  const navigate = useNavigate()
  const unread = notifications.filter(n => !n.read).length

  const handleLogout = () => {
    logout()
    navigate('/login')
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
      <div
        className="sidebar-edge-trigger"
        onMouseEnter={revealDock}
        onMouseLeave={queueClose}
        aria-hidden="true"
      />
    <aside
      className={cn(
        'relative flex flex-col h-screen transition-all duration-300 z-50 glass-surface border-r border-glass/10',
        'lg:fixed lg:top-0 lg:left-0 lg:w-[264px] lg:transition-[transform,opacity,box-shadow] lg:duration-[360ms] lg:ease-in-out lg:will-change-transform',
        collapsed ? 'w-16' : 'w-60'
      )}
      style={desktop ? { transform: dockOpen ? 'translate3d(0,0,0)' : 'translate3d(-100%,0,0)', opacity: dockOpen ? 1 : 0, boxShadow: dockOpen ? '0 0 34px rgba(0,180,216,.32)' : 'none' } : undefined}
      onMouseEnter={revealDock}
      onMouseLeave={queueClose}
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-4 py-5 border-b border-glass/10', collapsed && 'justify-center px-2')}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#0077B6] to-[#00B4D8] shadow-glow-sm">
          <Gem size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold font-sora gradient-text-bright leading-tight">Mistry Gems</p>
            <p className="text-[10px] text-glass-dim">Workflow Platform</p>
          </div>
        )}
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="px-4 py-3 border-b border-glass/10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 bg-gradient-to-br from-[#0077B6] to-[#00B4D8]">
              {user.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-highlight truncate">{user.name}</p>
              <p className="text-[10px] text-glass-dim">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-3 px-2 space-y-0.5">
        {navItems.map(item => {
          if (item.roles && user && !item.roles.includes(user.role)) return null
          const isNotif = item.path === '/notifications'
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn('sidebar-item', isActive && 'active')}
              title={collapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0 relative">
                {item.icon}
                {isNotif && unread > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#00B4D8] text-[8px] font-bold flex items-center justify-center text-white">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </span>
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

      {/* Collapse Toggle */}
      <button
        onClick={toggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full glass-card flex items-center justify-center text-glass hover:text-highlight transition-all hover:shadow-glow-sm z-10 lg:hidden"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
    </>
  )
}
