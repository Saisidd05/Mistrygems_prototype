import React, { useCallback, useEffect, useState } from 'react'
import { Building2, CalendarDays, Mail, MapPin, Star, UserCircle } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowButton } from '../../components/ui/GlowButton'
import { Modal } from '../../components/ui/Modal'

interface VendorReview {
  author: string
  rating: number
  comment: string
  date: string
}

interface Vendor {
  id: string
  name: string
  ownerName: string
  address: string
  email: string
  role: string
  avatar: string
  createdAt: string
  gstin: string
  rating: number | null
  reviewCount: number
  reviews: VendorReview[]
}

function getToken() {
  const saved = localStorage.getItem('mistry-auth')
  return saved ? JSON.parse(saved)?.token || '' : ''
}

function formatDate(value: string) {
  if (!value) return 'Not available'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-IN')
}

function Rating({ value, count }: { value: number | null; count: number }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-glass-dim">
      <Star size={14} className={value ? 'fill-amber-400 text-amber-400' : 'text-glass-dim'} />
      <span className="text-highlight font-semibold">{value ? value.toFixed(1) : 'New'}</span>
      <span>{count ? `${count} reviews` : 'No reviews yet'}</span>
    </div>
  )
}

export function IndustryVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [selected, setSelected] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadVendors = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/vendors', {
        cache: 'no-store',
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      const body = await response.json().catch(() => null)
      if (!response.ok) throw new Error(body?.error || 'Unable to load vendors.')
      setVendors(body)
    } catch (err) {
      setVendors([])
      setError(err instanceof Error ? err.message : 'Unable to load vendors.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void loadVendors() }, [loadVendors])

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Vendors</h1>
          <p className="page-subtitle">Registered workshops available on Mistry Gems for manufacturing requirements.</p>
        </div>
        <GlowButton variant="outline" size="sm" onClick={() => void loadVendors()} loading={loading}>Refresh</GlowButton>
      </div>

      {error && <GlassCard className="p-4 text-sm text-red-300 border-red-400/30">{error}</GlassCard>}

      {loading && !vendors.length ? (
        <GlassCard className="p-8 text-center text-glass-dim">Loading registered workshops...</GlassCard>
      ) : vendors.length === 0 ? (
        <GlassCard className="p-8 text-center text-glass-dim">No registered workshops found.</GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {vendors.map(vendor => (
            <GlassCard key={vendor.id} className="p-5 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-sm font-bold text-white overflow-hidden">
                  {vendor.avatar && (vendor.avatar.startsWith('http') || vendor.avatar.startsWith('/')) ? (
                    <img src={vendor.avatar} alt={vendor.name} className="w-full h-full object-cover" />
                  ) : (
                    vendor.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-bold font-sora text-highlight truncate">{vendor.name}</h2>
                  <p className="mt-1 flex items-center gap-1 text-xs text-glass-dim"><UserCircle size={13} />{vendor.ownerName || 'Workshop Owner'}</p>
                  <div className="mt-2"><Rating value={vendor.rating} count={vendor.reviewCount} /></div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-glass">
                <p className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 text-accent flex-shrink-0" />{vendor.address || 'Address not available'}</p>
                <p className="flex items-center gap-2"><Mail size={14} className="text-accent" />{vendor.email || 'Email not available'}</p>
              </div>

              <div className="mt-auto flex items-center justify-between gap-3">
                <span className="glass-badge"><Building2 size={12} /> Registered Workshop</span>
                <GlowButton size="sm" variant="outline" onClick={() => setSelected(vendor)}>View More</GlowButton>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name || 'Workshop Details'} maxWidth="lg">
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-glass/10 bg-white/5 p-3">
                <p className="text-[10px] uppercase text-glass-dim">Owner</p>
                <p className="mt-1 text-highlight">{selected.ownerName || 'Workshop Owner'}</p>
              </div>
              <div className="rounded-lg border border-glass/10 bg-white/5 p-3">
                <p className="text-[10px] uppercase text-glass-dim">Email</p>
                <p className="mt-1 text-highlight break-all">{selected.email || 'Not available'}</p>
              </div>
              <div className="rounded-lg border border-glass/10 bg-white/5 p-3">
                <p className="text-[10px] uppercase text-glass-dim">GSTIN</p>
                <p className="mt-1 text-highlight">{selected.gstin || 'Not added'}</p>
              </div>
              <div className="rounded-lg border border-glass/10 bg-white/5 p-3">
                <p className="text-[10px] uppercase text-glass-dim">Registered</p>
                <p className="mt-1 flex items-center gap-2 text-highlight"><CalendarDays size={14} />{formatDate(selected.createdAt)}</p>
              </div>
            </div>

            <div className="rounded-lg border border-glass/10 bg-white/5 p-3">
              <p className="text-[10px] uppercase text-glass-dim">Workshop Address</p>
              <p className="mt-1 text-sm text-highlight">{selected.address || 'Address not available'}</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold font-sora text-highlight">Reviews</h3>
                <Rating value={selected.rating} count={selected.reviewCount} />
              </div>
              {selected.reviews.length ? (
                <div className="space-y-3">
                  {selected.reviews.map((review, index) => (
                    <div key={`${review.author}-${index}`} className="rounded-lg border border-glass/10 bg-white/5 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold text-highlight">{review.author}</p>
                        <Rating value={review.rating || null} count={0} />
                      </div>
                      {review.comment && <p className="mt-2 text-xs text-glass">{review.comment}</p>}
                      {review.date && <p className="mt-2 text-[10px] text-glass-dim">{formatDate(review.date)}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <GlassCard className="p-5 text-center text-glass-dim">No reviews yet.</GlassCard>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
