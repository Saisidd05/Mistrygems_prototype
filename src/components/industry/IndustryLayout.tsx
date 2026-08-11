import React from 'react'
import { Bell, Building2, ClipboardList, FileCheck, FileText, LayoutDashboard, LogOut, MapPin, PlusCircle, Settings, Truck, UserCircle, Users } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { AnimatedBackground } from '../ui/AnimatedBackground'
import { cn } from '../../lib/utils'

const navigation = [
  { label: 'Dashboard', path: '/industry/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Post Requirement', path: '/industry/requirements/new', icon: <PlusCircle size={18} /> },
  { label: 'My Requirements', path: '/industry/requirements', icon: <ClipboardList size={18} /> },
  { label: 'Vendor Matching', path: '/industry/vendor-matching', icon: <Users size={18} /> },
  { label: 'Quotations', path: '/industry/quotations', icon: <FileText size={18} /> },
  { label: 'Purchase Orders', path: '/industry/purchase-orders', icon: <FileText size={18} /> },
  { label: 'Production Tracking', path: '/industry/production-tracking', icon: <Truck size={18} /> },
  { label: 'Quality Check Status', path: '/industry/quality-check', icon: <FileCheck size={18} /> },
  { label: 'Delivery Tracking', path: '/industry/delivery-tracking', icon: <MapPin size={18} /> },
  { label: 'Vendors', path: '/industry/vendors', icon: <Users size={18} /> },
  { label: 'Notifications', path: '/industry/notifications', icon: <Bell size={18} /> },
  { label: 'Company Profile', path: '/industry/company-profile', icon: <UserCircle size={18} /> },
  { label: 'Settings', path: '/industry/settings', icon: <Settings size={18} /> },
]

export function IndustryLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <>
      <AnimatedBackground />
      <div className="app-container">
        <aside className="relative flex h-screen w-60 flex-col z-20 glass-surface border-r border-glass/10">
          <div className="flex items-center gap-3 px-4 py-5 border-b border-glass/10">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#0077B6] to-[#00B4D8] shadow-glow-sm"><Building2 size={16} className="text-white" /></div>
            <div><p className="text-sm font-bold font-sora gradient-text-bright">Mistry Gems</p><p className="text-[10px] text-glass-dim">Industry Portal</p></div>
          </div>
          <div className="px-4 py-3 border-b border-glass/10"><p className="text-xs font-semibold text-highlight truncate">{user?.name}</p><p className="text-[10px] text-glass-dim">Industry Account</p></div>
          <nav className="flex-1 py-3 px-2 space-y-0.5">
            {navigation.map(item => <NavLink key={item.path} to={item.path} className={({ isActive }) => cn('sidebar-item', isActive && 'active')}><span>{item.icon}</span><span className="text-sm">{item.label}</span></NavLink>)}
          </nav>
          <div className="p-2 border-t border-glass/10"><button onClick={() => { logout(); navigate('/login') }} className="sidebar-item w-full text-red-400/70 hover:text-red-400 hover:bg-red-500/10"><LogOut size={18} /><span>Logout</span></button></div>
        </aside>
        <div className="main-content">
          <header className="glass-nav sticky top-0 z-20 flex items-center justify-between px-5 py-3"><div><h1 className="text-sm font-bold font-sora text-highlight">Industry Portal</h1><p className="text-[10px] text-glass-dim">Industry procurement workspace</p></div><span className="glass-badge">{user?.workshopName}</span></header>
          <main className="page-content">{children}</main>
        </div>
      </div>
    </>
  )
}
