import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useSidebar } from '@/context/SidebarContext'

interface LayoutProps {
  children: React.ReactNode
}

const pageVariants = {
  initial: { opacity: 0, y: 16, scale: 0.992 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, scale: 0.996, transition: { duration: 0.2 } },
}

export default function Layout({ children }: LayoutProps) {
  const { collapsed } = useSidebar()
  const location = useLocation()

  return (
    <div className="min-h-screen gradient-bg">
      {/* Ambient Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] bg-violet-400/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-400/8 rounded-full blur-3xl" />
      </div>

      <Sidebar />
      <Topbar />

      {/* Main Content */}
      <motion.main
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`pt-24 min-h-screen transition-[padding] duration-300 ${collapsed ? 'lg:pl-[88px]' : 'lg:pl-[260px]'}`}
      >
        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1600px] mx-auto">
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
