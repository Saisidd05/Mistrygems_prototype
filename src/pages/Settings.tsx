import { useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { useTheme } from '@/context/ThemeContext'
import {
  Building2,
  Users,
  Shield,
  Palette,
  Lock,
  Boxes,
  Save,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Section = 'company' | 'users' | 'roles' | 'appearance' | 'security' | 'integrations'

export default function Settings() {
  const [activeSection, setActiveSection] = useState<Section>('company')
  const { theme, toggleTheme } = useTheme()
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const navItems: Array<{ id: Section; label: string; icon: any }> = [
    { id: 'company', label: 'Company Profile', icon: Building2 },
    { id: 'users', label: 'Users & Staff', icon: Users },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security & Auth', icon: Lock },
    { id: 'integrations', label: 'Integrations', icon: Boxes },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Platform Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage organization details, team access, appearance & integrations
          </p>
        </div>
        <button onClick={handleSave} className="btn-primary text-xs">
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <GlassCard className="p-3 lg:col-span-1 h-fit">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left',
                  activeSection === item.id
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </GlassCard>

        {/* Content Panel */}
        <GlassCard className="p-6 lg:col-span-3">
          {activeSection === 'company' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                Company Profile
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Mistry Gems Pvt. Ltd."
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    GSTIN Number
                  </label>
                  <input
                    type="text"
                    defaultValue="24AAACM1234F1Z5"
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    defaultValue="info@mistrygems.com"
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    defaultValue="+91 98765 43210"
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                Appearance Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/30">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Theme Preference</p>
                    <p className="text-xs text-slate-400">Switch between Light and VisionOS Dark Mode</p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="btn-primary text-xs"
                  >
                    Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                Active System Users
              </h2>
              <p className="text-xs text-slate-400">6 Operator & Manager accounts active</p>
            </div>
          )}

          {activeSection === 'roles' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                Role Based Access Control (RBAC)
              </h2>
              <p className="text-xs text-slate-400">Manage permissions for Machine Operators, QC Staff & Admins</p>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                Security & Authentication
              </h2>
              <p className="text-xs text-slate-400">Two-Factor Authentication (2FA) is enabled for all Admin users.</p>
            </div>
          )}

          {activeSection === 'integrations' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                Connected Services & APIs
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span className="font-bold text-slate-800 dark:text-slate-200">WhatsApp Gateway</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Active</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Tally ERP Sync</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Active</span>
                </div>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}
