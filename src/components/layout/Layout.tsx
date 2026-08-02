import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useSidebar } from '@/context/SidebarContext'
import { useAuth } from '@/context/AuthContext'

interface LayoutProps {
  children: React.ReactNode
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
}

export default function Layout({ children }: LayoutProps) {
  const { collapsed } = useSidebar()
  const { userRole } = useAuth()
  const location = useLocation()

  // Client gets a simplified layout
  if (userRole === 'client') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Topbar />
        <Sidebar />
        <motion.main
          animate={{ paddingLeft: collapsed ? 88 : 260 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="pt-16 min-h-screen"
        >
          <div className="px-6 py-8 max-w-[1200px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.main>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Ambient Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-400/8 rounded-full blur-3xl" />
      </div>

      <Sidebar />
      <Topbar />

      {/* Main Content */}
      <motion.main
        animate={{ paddingLeft: collapsed ? 88 : 260 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="pt-16 min-h-screen"
      >
        <div className="px-6 py-8 max-w-[1600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  )
}
