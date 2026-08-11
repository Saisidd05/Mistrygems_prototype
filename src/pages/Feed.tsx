import React, { useCallback, useEffect, useState } from 'react'
import { Building2, CalendarDays, ClipboardList, FileText, IndianRupee, MapPin, Package, RefreshCw } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { GlowButton } from '../components/ui/GlowButton'

interface FeedRequirement {
  id: string
  jobTitle: string
  description: string
  category: string
  materialSpecification: string
  manufacturingProcess: string
  quantity: number
  unit: string
  certifications: string
  deliveryDate: string
  deliveryLocation: string
  budget?: number
  notes?: string
  drawingFile?: string
  technicalFile?: string
  status: 'Open' | 'Closed' | 'Matched' | 'In Production'
  createdAt: string
  companyName?: string
}

function getToken() {
  const saved = localStorage.getItem('mistry-auth')
  return saved ? JSON.parse(saved)?.token || '' : ''
}

function formatDate(value: string) {
  if (!value) return 'Not specified'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-IN')
}

function formatBudget(value?: number) {
  if (!value) return 'Budget not shared'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
}

export function Feed() {
  const [requirements, setRequirements] = useState<FeedRequirement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadFeed = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/industry-data?collection=requirements&feed=workshop', {
        cache: 'no-store',
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      const body = await response.json().catch(() => null)
      if (!response.ok) throw new Error(body?.error || 'Unable to load requirement feed.')
      setRequirements(body)
    } catch (err) {
      setRequirements([])
      setError(err instanceof Error ? err.message : 'Unable to load requirement feed.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void loadFeed() }, [loadFeed])

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Requirement Feed</h1>
          <p className="page-subtitle">Live industry requirements posted for workshop review and quotation planning.</p>
        </div>
        <GlowButton variant="outline" size="sm" icon={<RefreshCw size={15} />} onClick={() => void loadFeed()} loading={loading}>
          Refresh
        </GlowButton>
      </div>

      {error && <GlassCard className="p-4 text-sm text-red-300 border-red-400/30">{error}</GlassCard>}

      <div className="space-y-4">
        {loading && !requirements.length ? (
          <GlassCard className="p-8 text-center text-glass-dim">Loading industry requirements...</GlassCard>
        ) : requirements.length === 0 ? (
          <GlassCard className="p-8 text-center text-glass-dim">No industry requirements posted yet.</GlassCard>
        ) : requirements.map(item => (
          <GlassCard key={item.id} className="p-5 border-glass-bright">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="glass-badge">{item.status}</span>
                  <span className="text-[10px] uppercase tracking-wide text-glass-dim font-mono">{item.id}</span>
                </div>
                <h2 className="mt-3 text-lg font-bold font-sora text-highlight">{item.jobTitle}</h2>
                <p className="mt-2 text-sm text-glass leading-relaxed">{item.description}</p>
              </div>
              <div className="lg:text-right">
                <p className="flex lg:justify-end items-center gap-2 text-sm font-semibold text-highlight"><Building2 size={15} className="text-accent" />{item.companyName || 'Industry Account'}</p>
                <p className="mt-1 text-xs text-glass-dim">Posted {formatDate(item.createdAt)}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              <div className="rounded-lg border border-glass/10 bg-white/5 p-3">
                <p className="flex items-center gap-2 text-[10px] uppercase text-glass-dim"><ClipboardList size={13} />Category</p>
                <p className="mt-1 text-sm text-highlight">{item.category}</p>
              </div>
              <div className="rounded-lg border border-glass/10 bg-white/5 p-3">
                <p className="flex items-center gap-2 text-[10px] uppercase text-glass-dim"><Package size={13} />Quantity</p>
                <p className="mt-1 text-sm text-highlight">{item.quantity} {item.unit}</p>
              </div>
              <div className="rounded-lg border border-glass/10 bg-white/5 p-3">
                <p className="flex items-center gap-2 text-[10px] uppercase text-glass-dim"><CalendarDays size={13} />Delivery</p>
                <p className="mt-1 text-sm text-highlight">{formatDate(item.deliveryDate)}</p>
              </div>
              <div className="rounded-lg border border-glass/10 bg-white/5 p-3">
                <p className="flex items-center gap-2 text-[10px] uppercase text-glass-dim"><IndianRupee size={13} />Budget</p>
                <p className="mt-1 text-sm text-highlight">{formatBudget(item.budget)}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-glass">
              <p><span className="text-glass-dim">Material:</span> {item.materialSpecification}</p>
              <p><span className="text-glass-dim">Process:</span> {item.manufacturingProcess}</p>
              <p><span className="text-glass-dim">Certifications:</span> {item.certifications || 'Not specified'}</p>
              <p className="flex items-center gap-1"><MapPin size={13} className="text-accent" />{item.deliveryLocation}</p>
            </div>

            {(item.drawingFile || item.technicalFile || item.notes) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.drawingFile && <span className="glass-badge"><FileText size={12} /> Drawing: {item.drawingFile}</span>}
                {item.technicalFile && <span className="glass-badge"><FileText size={12} /> Technical: {item.technicalFile}</span>}
                {item.notes && <span className="text-xs text-glass-dim">{item.notes}</span>}
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
