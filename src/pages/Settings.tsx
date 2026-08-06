import React, { useEffect, useState } from 'react'
import { Save, Sun, Shield, Building } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { GlowButton } from '../components/ui/GlowButton'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../components/ui/Toast'
import { useAuth } from '../context/AuthContext'

export function Settings() {
  const { theme, toggleTheme } = useTheme()
  const { showToast } = useToast()
  const { user, updateProfile } = useAuth()

  const [companyName, setCompanyName] = useState('')
  const [gstin, setGstin] = useState('')
  const [address, setAddress] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { setCompanyName(user?.workshopName || ''); setAddress(user?.workshopAddress || ''); setGstin(user?.gstin || '') }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const result = await updateProfile({ workshopName: companyName, workshopAddress: address, gstin })
    setSaving(false)
    showToast(result.success ? 'Workshop details saved.' : result.error || 'Unable to save workshop details.', result.success ? 'success' : 'error')
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Platform Settings</h1>
          <p className="page-subtitle">Configure company details, GST preferences, theme modes, and system permissions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold font-sora text-highlight flex items-center gap-2">
            <Building size={18} className="text-accent" /> Workshop Profile
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-glass-dim mb-1.5">Company Name</label>
              <input className="glass-input" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
            </div>

            <div>
              <label className="block text-xs font-medium text-glass-dim mb-1.5">GSTIN Number</label>
              <input className="glass-input" value={gstin} onChange={e => setGstin(e.target.value)} required />
            </div>

            <div>
              <label className="block text-xs font-medium text-glass-dim mb-1.5">Factory Address</label>
              <textarea className="glass-input resize-none" rows={3} value={address} onChange={e => setAddress(e.target.value)} required />
            </div>

            <GlowButton type="submit" size="sm" loading={saving} icon={<Save size={14} />}>
              Save Workshop Details
            </GlowButton>
          </form>
        </GlassCard>

        <GlassCard className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold font-sora text-highlight mb-4 flex items-center gap-2">
              <Sun size={18} className="text-accent" /> Appearance Mode
            </h3>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-glass/10">
              <div>
                <p className="text-xs font-bold text-highlight">Theme Mode</p>
                <p className="text-[11px] text-glass-dim">Current mode is {theme.toUpperCase()}</p>
              </div>
              <GlowButton variant="outline" size="sm" onClick={toggleTheme}>
                Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
              </GlowButton>
            </div>
          </div>

          <div className="border-t border-glass/10 pt-6">
            <h3 className="text-sm font-bold font-sora text-highlight mb-2 flex items-center gap-2">
              <Shield size={18} className="text-accent" /> Role & Permissions
            </h3>
            <p className="text-xs text-glass-dim">Role-based Access Control (RBAC) is active across Owner, Manager, and Employee tiers.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
