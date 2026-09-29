import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, Sun, Moon, Menu, Search, LogOut, ChevronDown } from 'lucide-react'
import { getAccountType, useAuth } from '../../context/AuthContext'
import { useSidebar } from '../../context/SidebarContext'
import { useTheme } from '../../context/ThemeContext'
import { useAppData } from '../../context/AppDataContext'
import { Modal } from '../ui/Modal'
import { GlowButton } from '../ui/GlowButton'
import { useToast } from '../ui/Toast'

const pageNames: Record<string, string> = {
  // Workshop routes
  '/workshop/dashboard': 'Dashboard',
  '/workshop/feed': 'Industry Feed',
  '/workshop/jobs': 'Job Management',
  '/workshop/customers': 'Customers',
  '/workshop/employees': 'Employees',
  '/workshop/tasks': 'Task Board',
  '/workshop/quotations': 'Quotations',
  '/workshop/invoices': 'Invoices',
  '/workshop/inventory': 'Inventory',
  '/workshop/reports': 'Reports & Analytics',
  '/workshop/notifications': 'Notifications',

  // Industry routes
  '/industry/dashboard': 'Industry Dashboard',
  '/industry/requirements/new': 'Post Requirement',
  '/industry/requirements': 'My Requirements',
  '/industry/quotations': 'Quotations',
  '/industry/purchase-orders': 'Purchase Orders',
  '/industry/production-tracking': 'Production Tracking',
  '/industry/quality-check': 'Quality Check Status',
  '/industry/delivery-tracking': 'Delivery Tracking',
  '/industry/vendors': 'Registered Workshops',
  '/industry/chats': 'Workshop Chats',
  '/industry/notifications': 'Notifications',
  '/industry/company-profile': 'Company Profile',
  '/industry/settings': 'Settings',
}

export function Topbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, updateProfile } = useAuth()
  const { showToast } = useToast()
  const [editingProfile, setEditingProfile] = useState(false)
  const [workshopName, setWorkshopName] = useState('')
  const [workshopAddress, setWorkshopAddress] = useState('')
  const [gstin, setGstin] = useState('')
  const { toggle } = useSidebar()
  const { theme, toggleTheme } = useTheme()
  const { notifications } = useAppData()
  const [showProfile, setShowProfile] = useState(false)

  const isIndustry = getAccountType(user) === 'industry' || location.pathname.startsWith('/industry')
  const notifPath = isIndustry ? '/industry/notifications' : '/workshop/notifications'
  const unread = notifications.filter(n => !n.read).length
  const pageName = pageNames[location.pathname] || (isIndustry ? 'Industry Portal' : 'Mistry Gems')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  const openProfile = () => { setWorkshopName(user?.workshopName || ''); setWorkshopAddress(user?.workshopAddress || ''); setGstin(user?.gstin || ''); setEditingProfile(true); setShowProfile(false) }
  const saveProfile = async (event: React.FormEvent) => { event.preventDefault(); const result = await updateProfile({ workshopName, workshopAddress, gstin }); showToast(result.success ? 'Profile updated.' : result.error || 'Could not update profile.', result.success ? 'success' : 'error'); if (result.success) setEditingProfile(false) }

  return (
    <header className="glass-nav sticky top-0 z-20 flex items-center justify-between px-5 py-3 gap-4">
      {/* Left: Menu + Page Name */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="p-2 rounded-xl text-glass-dim hover:text-highlight hover:bg-white/5 transition-all md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-sm font-bold font-sora text-highlight">{pageName}</h1>
          <p className="text-[10px] text-glass-dim hidden sm:block">{isIndustry ? 'Industry Procurement Workspace' : 'Mistry Gems Platform'}</p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-glass-dim hover:text-highlight hover:bg-white/5 transition-all"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate(notifPath)}
          className="relative p-2 rounded-xl text-glass-dim hover:text-highlight hover:bg-white/5 transition-all"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#00B4D8] animate-pulse" />
          )}
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(s => !s)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/5 transition-all"
            id="topbar-profile-btn"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-xs font-bold text-white overflow-hidden">
              {user?.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('/')) ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.avatar || 'U'
              )}
            </div>
            <span className="text-xs font-medium text-glass hidden sm:block">{user?.name?.split(' ')[0]}</span>
            <ChevronDown size={12} className="text-glass-dim hidden sm:block" />
          </button>

          {showProfile && (
            <div
              className="absolute right-0 top-full mt-2 w-48 glass-card p-1 z-50"
              onMouseLeave={() => setShowProfile(false)}
            >
              <div className="px-3 py-2 border-b border-glass/10">
                <p className="text-xs font-semibold text-highlight">{user?.name}</p>
                <p className="text-[10px] text-glass-dim">{isIndustry ? (user?.workshopName || 'Industry Account') : user?.role}</p>
              </div>
              <button
                onClick={openProfile}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-glass hover:bg-white/5 rounded-lg transition-all"
              >
                Edit profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-all mt-1"
              >
                <LogOut size={13} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <Modal open={editingProfile} onClose={() => setEditingProfile(false)} title="Edit Profile">
        <form onSubmit={saveProfile} className="space-y-3"><label className="block text-xs text-glass-dim">Company name<input className="glass-input mt-1" value={workshopName} onChange={e => setWorkshopName(e.target.value)} required /></label><label className="block text-xs text-glass-dim">Address<input className="glass-input mt-1" value={workshopAddress} onChange={e => setWorkshopAddress(e.target.value)} required /></label><label className="block text-xs text-glass-dim">GSTIN<input className="glass-input mt-1" value={gstin} onChange={e => setGstin(e.target.value)} /></label><GlowButton type="submit" size="sm">Save profile</GlowButton></form>
      </Modal>
    </header>
  )
}
