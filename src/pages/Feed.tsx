import React, { useCallback, useEffect, useState } from 'react'
import {
  Building2, CalendarDays, ClipboardList, FileText, IndianRupee,
  MapPin, Package, RefreshCw, Send
} from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { GlowButton } from '../components/ui/GlowButton'
import { Modal } from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import { formatCurrency } from '../lib/utils'

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

// ── Quotation Submit Modal ─────────────────────────────────────────────────
interface QuoteModalProps {
  requirement: FeedRequirement
  onClose: () => void
}

function QuoteModal({ requirement, onClose }: QuoteModalProps) {
  const { showToast } = useToast()
  const [description, setDescription] = useState(requirement.jobTitle)
  const [quantity, setQuantity] = useState(requirement.quantity)
  const [unitCost, setUnitCost] = useState(0)
  const [gstRate, setGstRate] = useState(18)
  const [deliveryDays, setDeliveryDays] = useState(0)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const subtotal = quantity * unitCost
  const gstAmount = (subtotal * gstRate) / 100
  const grandTotal = subtotal + gstAmount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (unitCost <= 0) {
      showToast('Please enter a valid unit price.', 'warning')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ requirementId: requirement.id, description, quantity, unitCost, gstRate, deliveryDays, notes }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Failed to submit quotation.')
      showToast(
        body.emailSent
          ? 'Quotation submitted and the industry was notified by email.'
          : 'Quotation submitted successfully. The industry can review it in their portal.',
        'success',
      )
      onClose()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Submission failed.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-1">
      {/* Requirement info */}
      <div className="p-3 rounded-xl bg-white/5 border border-glass/10 space-y-1">
        <p className="text-[10px] text-glass-dim uppercase tracking-wider">Requirement</p>
        <p className="text-sm font-bold text-highlight font-sora">{requirement.jobTitle}</p>
        <p className="text-[11px] text-glass-dim">{requirement.companyName || 'Industry Account'} · {requirement.category}</p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs text-glass-dim mb-1">Scope of Work / Description</label>
        <textarea
          className="glass-input resize-none text-xs"
          rows={2}
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-glass-dim mb-1">Quantity (Units)</label>
          <input type="number" className="glass-input text-xs" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} required />
        </div>
        <div>
          <label className="block text-xs text-glass-dim mb-1">Unit Price (₹)</label>
          <input type="number" className="glass-input text-xs" min={1} value={unitCost || ''} placeholder="0" onChange={e => setUnitCost(Number(e.target.value))} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-glass-dim mb-1">GST Rate (%)</label>
          <select className="glass-select text-xs" value={gstRate} onChange={e => setGstRate(Number(e.target.value))}>
            <option value={5}>5% – Job Work Special</option>
            <option value={12}>12% – Standard Job Work</option>
            <option value={18}>18% – General Manufacturing</option>
            <option value={28}>28% – Specialized Goods</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-glass-dim mb-1">Delivery Days</label>
          <input type="number" className="glass-input text-xs" min={1} value={deliveryDays || ''} placeholder="e.g. 14" onChange={e => setDeliveryDays(Number(e.target.value))} />
        </div>
      </div>

      {/* Live Total */}
      {unitCost > 0 && (
        <div className="rounded-xl bg-white/5 border border-glass/10 p-3 space-y-1.5 text-xs">
          <div className="flex justify-between text-glass-dim">
            <span>Subtotal ({quantity} × ₹{unitCost})</span>
            <span className="font-mono">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-glass-dim">
            <span>GST ({gstRate}%)</span>
            <span className="font-mono">{formatCurrency(gstAmount)}</span>
          </div>
          <div className="flex justify-between font-bold text-highlight border-t border-glass/10 pt-1.5">
            <span>Grand Total</span>
            <span className="font-mono text-emerald-400">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-xs text-glass-dim mb-1">Additional Notes (Optional)</label>
        <textarea className="glass-input resize-none text-xs" rows={2} placeholder="Capacity, certifications, past experience..." value={notes} onChange={e => setNotes(e.target.value)} />
      </div>

      <div className="flex gap-3 justify-end pt-1">
        <GlowButton type="button" variant="outline" size="sm" onClick={onClose}>Cancel</GlowButton>
        <GlowButton type="submit" size="sm" loading={loading} icon={<Send size={14} />}>
          Submit Quotation
        </GlowButton>
      </div>
    </form>
  )
}

// ── Main Feed Component ────────────────────────────────────────────────────
export function Feed() {
  const [requirements, setRequirements] = useState<FeedRequirement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quoting, setQuoting] = useState<FeedRequirement | null>(null)

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
          <p className="page-subtitle">Live industry requirements — review and submit quotations directly.</p>
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
              <div className="lg:text-right flex-shrink-0 space-y-2">
                <p className="flex lg:justify-end items-center gap-2 text-sm font-semibold text-highlight">
                  <Building2 size={15} className="text-accent" />{item.companyName || 'Industry Account'}
                </p>
                <p className="text-xs text-glass-dim">Posted {formatDate(item.createdAt)}</p>
                {/* Send Quotation Button */}
                <GlowButton
                  size="sm"
                  icon={<Send size={14} />}
                  onClick={() => setQuoting(item)}
                  className="w-full lg:w-auto"
                >
                  Send Quotation
                </GlowButton>
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

      {/* Quotation Submit Modal */}
      {quoting && (
        <Modal
          open={!!quoting}
          onClose={() => setQuoting(null)}
          title={`Submit Quotation — ${quoting.jobTitle}`}
        >
          <QuoteModal requirement={quoting} onClose={() => setQuoting(null)} />
        </Modal>
      )}
    </div>
  )
}
