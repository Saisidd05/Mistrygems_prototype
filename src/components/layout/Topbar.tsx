import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Building2,
  Menu,
  LogOut,
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useSidebar } from '@/context/SidebarContext'
import { useAuth } from '@/context/AuthContext'
import { notifications } from '@/lib/data'
import { getInitials, cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

const companies = ['Mistry Gems Pvt. Ltd.', 'Mistry Exports', 'Mistry Retail']
const unreadCount = notifications.filter((n) => !n.read).length

const roleLabels: Record<string, string> = {
  owner: 'Owner',
  manager: 'Manager',
  employee: 'Employee',
  client: 'Client',
}

export default function Topbar() {
  const { theme, toggleTheme } = useTheme()
  const { collapsed, toggleSidebar } = useSidebar()
  const { userName, userRole, logout } = useAuth()
  const navigate = useNavigate()
  const [selectedCompany, setSelectedCompany] = useState(companies[0])
  const [companyOpen, setCompanyOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isClient = userRole === 'client'

  return (
    <header
      className="glass-nav sticky top-0 z-30 flex items-center gap-4 px-6 h-16"
      style={{ paddingLeft: collapsed ? '88px' : '276px', transition: 'padding 0.3s ease' }}
    >
      {/* Mobile menu */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
      >
        <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
      </button>

      {/* Company Switcher — hidden for clients */}
      {!isClient && (
        <div className="relative">
          <button
            onClick={() => setCompanyOpen((o) => !o)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all duration-200 group"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-36 truncate hidden sm:block">
              {selectedCompany}
            </span>
            <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 transition-transform hidden sm:block', companyOpen && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {companyOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-2 left-0 w-56 glass-card py-1.5 z-50"
              >
                {companies.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setSelectedCompany(c); setCompanyOpen(false) }}
                    className={cn(
                      'w-full text-left px-4 py-2.5 text-sm transition-colors',
                      selectedCompany === c
                        ? 'text-orange-600 dark:text-orange-400 font-medium bg-orange-50/60 dark:bg-orange-900/20'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Search — hidden for clients */}
      {!isClient && (
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs, customers, employees…"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-400/40 transition-all duration-200"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">
              ⌘K
            </kbd>
          </div>
        </div>
      )}

      {isClient && <div className="flex-1" />}

      <div className="flex items-center gap-2 ml-auto">
        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
        >
          <AnimatePresence mode="wait">
            {theme === 'light' ? (
              <motion.div key="moon" initial={{ opacity: 0, rotate: -30 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 30 }}>
                <Moon className="w-4.5 h-4.5 text-slate-600" />
              </motion.div>
            ) : (
              <motion.div key="sun" initial={{ opacity: 0, rotate: 30 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -30 }}>
                <Sun className="w-4.5 h-4.5 text-yellow-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Notification Bell */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          onClick={() => navigate('/notifications')}
        >
          <Bell className="w-4.5 h-4.5 text-slate-600 dark:text-slate-300" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </motion.button>

        {/* User Profile */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors ml-1"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-xs font-bold text-white">
                {userName ? getInitials(userName) : 'MG'}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-none">
                {userName || 'User'}
              </p>
              <p className="text-[10px] text-orange-600 dark:text-orange-400 mt-0.5 font-medium">
                {userRole ? roleLabels[userRole] : 'Admin'}
              </p>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
          </motion.button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-2 right-0 w-48 glass-card py-1.5 z-50"
              >
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
