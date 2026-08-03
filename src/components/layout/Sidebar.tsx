import { motion, AnimatePresence } from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  UserCheck,
  CheckSquare,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Package,
  Receipt,
} from 'lucide-react'
import { useSidebar } from '@/context/SidebarContext'
import { useAuth, UserRole } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const allNavItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['owner', 'manager', 'client'] as UserRole[] },
  { to: '/jobs', icon: Briefcase, label: 'Jobs', roles: ['owner', 'manager'] as UserRole[] },
  { to: '/quotations', icon: FileText, label: 'Quotations', roles: ['owner', 'manager'] as UserRole[] },
  { to: '/customers', icon: Users, label: 'Customers', roles: ['owner'] as UserRole[] },
  { to: '/employees', icon: UserCheck, label: 'Employees', roles: ['owner', 'manager'] as UserRole[] },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks', roles: ['owner', 'manager', 'employee'] as UserRole[] },
  { to: '/inventory', icon: Package, label: 'Inventory', roles: ['owner', 'manager'] as UserRole[] },
  { to: '/invoices', icon: Receipt, label: 'Invoices', roles: ['owner'] as UserRole[] },
  { to: '/reports', icon: BarChart3, label: 'Reports', roles: ['owner'] as UserRole[] },
  { to: '/notifications', icon: Bell, label: 'Notifications', roles: ['owner', 'manager', 'employee', 'client'] as UserRole[] },
  { to: '/settings', icon: Settings, label: 'Settings', roles: ['owner'] as UserRole[] },
]

export default function Sidebar() {
  const { collapsed, toggleSidebar } = useSidebar()
  const { userRole } = useAuth()
  const location = useLocation()

  const navItems = allNavItems.filter((item) =>
    userRole ? item.roles.includes(userRole) : true
  )

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="glass-sidebar fixed left-0 top-0 h-full z-40 flex flex-col overflow-hidden"
    >
      {/* Logo Area */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/20 dark:border-white/5">
        <div className="relative flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/25">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="font-bold text-[15px] tracking-tight text-blue-700 dark:text-sky-300 leading-none">
                Mistry Gems
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Workshop Platform
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.to === '/'
              ? location.pathname === '/' || location.pathname === '/dashboard'
              : location.pathname.startsWith(item.to)

          return (
            <NavLink key={item.to} to={item.to}>
              <motion.div
                whileHover={{ x: collapsed ? 0 : 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'nav-item relative group',
                  isActive && 'active',
                  collapsed && 'justify-center px-0'
                )}
              >
                <item.icon
                  className={cn(
                    'w-[18px] h-[18px] flex-shrink-0 transition-colors',
                    isActive
                      ? 'text-blue-700 dark:text-sky-300'
                      : 'text-slate-500 dark:text-slate-400'
                  )}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-blue-600"
                  />
                )}

                {/* Tooltip on collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 dark:bg-slate-700 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg transition-opacity">
                    {item.label}
                  </div>
                )}
              </motion.div>
            </NavLink>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 py-4 border-t border-white/20 dark:border-white/5">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          className={cn(
            'flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
            'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60',
            collapsed && 'justify-center px-0'
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.aside>
  )
}
