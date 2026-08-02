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
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useSidebar } from '@/context/SidebarContext'
import { notifications } from '@/lib/data'
import { getInitials, cn } from '@/lib/utils'

const companies = ['Mistry Gems Pvt. Ltd.', 'Mistry Exports', 'Mistry Retail']
const unreadCount = notifications.filter((n) => !n.read).length

export default function Topbar() {
  const { theme, toggleTheme } = useTheme()
  const { collapsed, toggleSidebar } = useSidebar()
  const [selectedCompany, setSelectedCompany] = useState(companies[0])
  const [companyOpen, setCompanyOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  return (
    <header
      className={`glass-nav sticky top-3 mx-3 rounded-[22px] z-30 flex items-center gap-3 px-3 sm:px-5 h-16 transition-[padding] duration-300 ${collapsed ? 'lg:ml-[88px]' : 'lg:ml-[276px]'}`}
    >
      {/* Mobile menu */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2.5 rounded-2xl bg-white/30 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
      >
        <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
      </button>

      {/* Company Switcher */}
      <div className="relative">
        <button
          onClick={() => setCompanyOpen((o) => !o)}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-white/55 dark:hover:bg-slate-800/60 transition-all duration-200 group"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
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
                      ? 'text-blue-600 dark:text-blue-400 font-medium bg-blue-50/60 dark:bg-blue-900/20'
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

      {/* Search */}
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs, customers, employees…"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm bg-white/45 dark:bg-slate-800/50 border border-white/60 dark:border-slate-700/40 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/40 transition-all duration-200"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

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
          onClick={() => window.location.href = '/notifications'}
        >
          <Bell className="w-4.5 h-4.5 text-slate-600 dark:text-slate-300" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </motion.button>

        {/* User Profile */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors ml-1"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-xs font-bold text-white">MG</span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-none">Sai Mistry</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Admin</p>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
        </motion.button>
      </div>
    </header>
  )
}
