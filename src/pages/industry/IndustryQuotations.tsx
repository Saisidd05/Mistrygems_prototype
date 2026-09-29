import React, { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, Clock, XCircle, Building2, IndianRupee, CalendarDays, RefreshCw } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowButton } from '../../components/ui/GlowButton'
import { useToast } from '../../components/ui/Toast'
import { formatCurrency } from '../../lib/utils'

interface Quotation {
  id: string
  requirementId: string
  requirementTitle: string
  workshopName: string
  description: string
  quantity: number
  unitCost: number
  gstRate: number
  gstAmount: number
  subtotal: number
  grandTotal: number
  deliveryDays?: number
  notes?: string
  status: 'Pending' | 'Accepted' | 'Rejected'
  createdAt: string
}

function getToken() {
  const saved = localStorage.getItem('mistry-auth')
  return saved ? JSON.parse(saved)?.token || '' : ''
}

const statusConfig = {
  Pending: { label: 'Pending Review', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: <Clock size={13} /> },
  Accepted: { label: 'Accepted', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: <CheckCircle2 size={13} /> },
  Rejected: { label: 'Rejected', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: <XCircle size={13} /> },
}

export function IndustryQuotations() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const { showToast } = useToast()

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/quotations', {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Failed to load quotations.')
      setQuotations(body)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quotations.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const updateStatus = async (id: string, status: 'Accepted' | 'Rejected') => {
    setUpdating(id)
    try {
      const res = await fetch('/api/quotations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ id, status }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Update failed.')
      setQuotations(prev => prev.map(q => q.id === id ? { ...q, status } : q))
      showToast(`Quotation ${status.toLowerCase()} successfully.`, 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Update failed.', 'error')
    } finally {
      setUpdating(null)
    }
  }

  const pending = quotations.filter(q => q.status === 'Pending').length
  const accepted = quotations.filter(q => q.status === 'Accepted').length

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Received Quotations</h1>
          <p className="page-subtitle">Review quotations submitted by workshops for your requirements.</p>
        </div>
        <GlowButton variant="outline" size="sm" icon={<RefreshCw size={15} />} onClick={() => void load()} loading={loading}>
          Refresh
        </GlowButton>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Received', val: quotations.length, color: 'text-accent' },
          { label: 'Pending Review', val: pending, color: 'text-amber-400' },
          { label: 'Accepted', val: accepted, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={`text-2xl font-bold font-sora ${s.color}`}>{s.val}</p>
            <p className="text-[11px] text-glass-dim mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {error && <GlassCard className="p-4 text-sm text-red-300 border-red-400/30">{error}</GlassCard>}

      {loading && !quotations.length ? (
        <GlassCard className="p-10 text-center text-glass-dim">Loading quotations...</GlassCard>
      ) : quotations.length === 0 ? (
        <GlassCard className="p-10 text-center text-glass-dim">
          No quotations received yet. Workshops will submit quotes after you post a requirement.
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {quotations.map(q => {
            const cfg = statusConfig[q.status]
            return (
              <GlassCard key={q.id} className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="min-w-0 space-y-1">
                    {/* Status badge */}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.color}`}>
                      {cfg.icon} {cfg.label}
                    </span>
                    <h2 className="text-base font-bold font-sora text-highlight mt-2">{q.requirementTitle}</h2>
                    <p className="flex items-center gap-2 text-xs text-glass-dim">
                      <Building2 size={13} className="text-accent" /> {q.workshopName}
                    </p>
                    <p className="text-xs text-glass leading-relaxed mt-1">{q.description}</p>
                  </div>

                  {/* Amount */}
                  <div className="flex-shrink-0 text-right space-y-1">
                    <p className="text-2xl font-extrabold font-sora text-emerald-400">{formatCurrency(q.grandTotal)}</p>
                    <p className="text-[10px] text-glass-dim">incl. {q.gstRate}% GST</p>
                    <p className="text-[10px] font-mono text-glass-dim">{q.id}</p>
                  </div>
                </div>

                {/* Details grid */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-lg bg-white/5 border border-glass/10 p-2.5">
                    <p className="text-[10px] text-glass-dim uppercase">Qty</p>
                    <p className="text-sm font-semibold text-highlight">{q.quantity} units</p>
                  </div>
                  <div className="rounded-lg bg-white/5 border border-glass/10 p-2.5">
                    <p className="text-[10px] text-glass-dim uppercase">Unit Price</p>
                    <p className="text-sm font-semibold text-highlight">{formatCurrency(q.unitCost)}</p>
                  </div>
                  <div className="rounded-lg bg-white/5 border border-glass/10 p-2.5">
                    <p className="text-[10px] text-glass-dim uppercase">GST</p>
                    <p className="text-sm font-semibold text-highlight">{formatCurrency(q.gstAmount)}</p>
                  </div>
                  <div className="rounded-lg bg-white/5 border border-glass/10 p-2.5">
                    <p className="text-[10px] text-glass-dim uppercase flex items-center gap-1"><CalendarDays size={11} />Delivery</p>
                    <p className="text-sm font-semibold text-highlight">{q.deliveryDays ? `${q.deliveryDays} days` : 'Not specified'}</p>
                  </div>
                </div>

                {q.notes && (
                  <p className="mt-3 text-xs text-glass-dim bg-white/5 border border-glass/10 rounded-lg p-2.5">
                    <span className="text-glass font-semibold">Notes: </span>{q.notes}
                  </p>
                )}

                {/* Actions */}
                {q.status === 'Pending' && (
                  <div className="mt-4 flex gap-2 justify-end">
                    <GlowButton
                      variant="outline"
                      size="sm"
                      loading={updating === q.id}
                      onClick={() => updateStatus(q.id, 'Rejected')}
                      className="text-red-400 border-red-400/30 hover:bg-red-500/10"
                    >
                      Reject
                    </GlowButton>
                    <GlowButton
                      size="sm"
                      loading={updating === q.id}
                      onClick={() => updateStatus(q.id, 'Accepted')}
                    >
                      Accept Quotation
                    </GlowButton>
                  </div>
                )}

                <p className="mt-3 text-[10px] text-glass-dim text-right">
                  Received {new Date(q.createdAt).toLocaleString('en-IN')} · Req: {q.requirementId}
                </p>
              </GlassCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
