import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Building2,
  CalendarDays,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Star,
  UserCircle,
  X,
} from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowButton } from '../../components/ui/GlowButton'
import { Modal } from '../../components/ui/Modal'
import { useToast } from '../../components/ui/Toast'

// ─── Types ────────────────────────────────────────────────────────────────────

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
  phone: string
  role: string
  avatar: string
  createdAt: string
  gstin: string
  rating: number | null
  reviewCount: number
  reviews: VendorReview[]
}

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  text: string
  createdAt: string
  isSelf: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getToken() {
  const saved = localStorage.getItem('mistry-auth')
  return saved ? (JSON.parse(saved)?.token ?? '') : ''
}

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' }
}

function formatDate(value: string) {
  if (!value) return 'Not available'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-IN')
}

function formatTime(value: string) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function RatingDisplay({ value, count }: { value: number | null; count: number }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-glass-dim">
      <Star size={14} className={value ? 'fill-amber-400 text-amber-400' : 'text-glass-dim'} />
      <span className="text-highlight font-semibold">{value ? value.toFixed(1) : 'New'}</span>
      <span>{count ? `${count} reviews` : 'No reviews yet'}</span>
    </div>
  )
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110 focus:outline-none"
          aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
        >
          <Star
            size={28}
            className={
              n <= (hovered || value)
                ? 'fill-amber-400 text-amber-400'
                : 'text-glass-dim'
            }
          />
        </button>
      ))}
    </div>
  )
}

// ─── Chat Modal ───────────────────────────────────────────────────────────────

function ChatModal({
  workshop,
  onClose,
}: {
  workshop: Vendor
  onClose: () => void
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Load chat history
  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoadingHistory(true)
      try {
        const res = await fetch(`/api/chat?workshopId=${encodeURIComponent(workshop.id)}`, {
          headers: authHeaders(),
        })
        if (res.ok) {
          const data: ChatMessage[] = await res.json()
          if (!cancelled) setMessages(Array.isArray(data) ? data : [])
        }
      } catch {
        // silently fail — chat still usable for new messages
      } finally {
        if (!cancelled) setLoadingHistory(false)
      }
    }
    void load()
    return () => { cancelled = true }
  }, [workshop.id])

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    const trimmed = text.trim()
    if (!trimmed || sending) return
    setSending(true)
    const optimistic: ChatMessage = {
      id: `opt-${Date.now()}`,
      senderId: 'me',
      senderName: 'You',
      text: trimmed,
      createdAt: new Date().toISOString(),
      isSelf: true,
    }
    setMessages(prev => [...prev, optimistic])
    setText('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ workshopId: workshop.id, text: trimmed }),
      })
      if (res.ok) {
        const saved: ChatMessage = await res.json()
        setMessages(prev => prev.map(m => (m.id === optimistic.id ? saved : m)))
      }
    } catch {
      // keep optimistic message
    } finally {
      setSending(false)
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 w-full sm:w-[480px] h-[90vh] sm:h-[600px] flex flex-col rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(0,18,36,0.97) 0%, rgba(0,40,70,0.97) 100%)',
          border: '1px solid rgba(0,180,216,0.25)',
          boxShadow: '0 24px 80px rgba(0,119,182,0.4)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3.5 border-b"
          style={{ borderColor: 'rgba(0,180,216,0.2)', background: 'rgba(0,119,182,0.15)' }}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {workshop.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{workshop.name}</p>
            <p className="text-[11px] text-[#00B4D8]">Workshop</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-glass-dim hover:text-white"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
          {loadingHistory ? (
            <p className="text-center text-xs text-glass-dim py-8">Loading messages…</p>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-glass-dim">
              <MessageCircle size={40} className="opacity-30" />
              <p className="text-xs text-center">
                No messages yet. Say hi to <span className="text-highlight">{workshop.name}</span>!
              </p>
            </div>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
              >
                {!msg.isSelf && (
                  <p className="text-[10px] text-glass-dim mb-1 ml-1">{msg.senderName}</p>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    msg.isSelf
                      ? 'rounded-br-sm bg-gradient-to-br from-[#0077B6] to-[#00B4D8] text-white'
                      : 'rounded-bl-sm bg-white/8 text-glass border border-glass/10'
                  }`}
                >
                  {msg.text}
                </div>
                <p className="text-[10px] text-glass-dim mt-1 mx-1">
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div
          className="flex items-end gap-2 p-3 border-t"
          style={{ borderColor: 'rgba(0,180,216,0.2)' }}
        >
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type a message… (Enter to send)"
            rows={1}
            className="flex-1 resize-none rounded-xl px-3.5 py-2.5 text-sm bg-white/8 border border-glass/15 text-glass placeholder:text-glass-dim focus:outline-none focus:border-[#00B4D8]/50 transition-colors max-h-[100px]"
            style={{ lineHeight: '1.5' }}
          />
          <button
            onClick={() => void handleSend()}
            disabled={!text.trim() || sending}
            className="p-2.5 rounded-xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] text-white disabled:opacity-40 hover:opacity-90 transition-opacity flex-shrink-0"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Review Modal ─────────────────────────────────────────────────────────────

function ReviewModal({
  workshop,
  onClose,
  onSubmitted,
}: {
  workshop: Vendor
  onClose: () => void
  onSubmitted: (updated: Vendor) => void
}) {
  const { showToast } = useToast()
  const [stars, setStars] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    if (stars === 0) {
      showToast('Please select a star rating before submitting.', 'error')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ workshopId: workshop.id, rating: stars, comment }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to submit review.')
      showToast('Review submitted successfully! ⭐', 'success')
      onSubmitted(data.vendor as Vendor)
      onClose()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to submit review.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const starLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

  return (
    <Modal open onClose={onClose} title={`Review — ${workshop.name}`} maxWidth="sm">
      <div className="space-y-5">
        {/* Star picker */}
        <div className="flex flex-col items-center gap-3 py-2">
          <StarPicker value={stars} onChange={setStars} />
          <p className="text-sm font-semibold text-highlight h-5">
            {stars ? starLabels[stars] : 'Tap to rate'}
          </p>
        </div>

        {/* Comment */}
        <div className="space-y-1.5">
          <label className="text-xs uppercase text-glass-dim tracking-wide">
            Your Review <span className="lowercase normal-case">(optional)</span>
          </label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Share your experience with this workshop…"
            rows={4}
            maxLength={500}
            className="w-full rounded-xl px-3.5 py-3 text-sm bg-white/5 border border-glass/15 text-glass placeholder:text-glass-dim focus:outline-none focus:border-[#00B4D8]/50 resize-none transition-colors"
          />
          <p className="text-right text-[10px] text-glass-dim">{comment.length}/500</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-1">
          <GlowButton variant="ghost" size="sm" onClick={onClose} disabled={submitting}>
            Cancel
          </GlowButton>
          <GlowButton size="sm" onClick={() => void handleSubmit()} loading={submitting} disabled={stars === 0}>
            Submit Review
          </GlowButton>
        </div>
      </div>
    </Modal>
  )
}

// ─── Details Modal ────────────────────────────────────────────────────────────

function DetailsModal({
  vendor,
  onClose,
  onOpenReview,
  onOpenChat,
}: {
  vendor: Vendor
  onClose: () => void
  onOpenReview: () => void
  onOpenChat: () => void
}) {
  return (
    <Modal open onClose={onClose} title={vendor.name} maxWidth="lg">
      <div className="space-y-5">
        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-glass/10 bg-white/5 p-3">
            <p className="text-[10px] uppercase text-glass-dim">Owner Name</p>
            <p className="mt-1 font-semibold text-highlight">{vendor.ownerName || 'Workshop Owner'}</p>
          </div>
          <div className="rounded-lg border border-glass/10 bg-white/5 p-3">
            <p className="text-[10px] uppercase text-glass-dim">Email Address</p>
            <p className="mt-1 font-semibold text-highlight break-all">{vendor.email || 'Not available'}</p>
          </div>
          <div className="rounded-lg border border-glass/10 bg-white/5 p-3">
            <p className="text-[10px] uppercase text-glass-dim">Phone Number</p>
            <a
              href={`tel:${vendor.phone.replace(/\s/g, '')}`}
              className="mt-1 flex items-center gap-1.5 font-semibold text-[#00B4D8] hover:text-white transition-colors"
            >
              <Phone size={13} /> {vendor.phone}
            </a>
          </div>
          <div className="rounded-lg border border-glass/10 bg-white/5 p-3">
            <p className="text-[10px] uppercase text-glass-dim">GSTIN</p>
            <p className="mt-1 font-semibold text-highlight">{vendor.gstin || 'Not added'}</p>
          </div>
          <div className="rounded-lg border border-glass/10 bg-white/5 p-3 sm:col-span-2">
            <p className="text-[10px] uppercase text-glass-dim">Registration Date</p>
            <p className="mt-1 flex items-center gap-2 font-semibold text-highlight">
              <CalendarDays size={14} />
              {formatDate(vendor.createdAt)}
            </p>
          </div>
        </div>

        {/* Address */}
        <div className="rounded-lg border border-glass/10 bg-white/5 p-3">
          <p className="text-[10px] uppercase text-glass-dim">Workshop Address</p>
          <p className="mt-1 text-sm text-highlight">{vendor.address || 'Address not available'}</p>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2">
          <GlowButton size="sm" onClick={onOpenChat}>
            <MessageCircle size={14} className="mr-1.5" /> Chat
          </GlowButton>
          <a href={`tel:${vendor.phone.replace(/\s/g, '')}`}>
            <GlowButton size="sm" variant="outline">
              <Phone size={14} className="mr-1.5" /> Call
            </GlowButton>
          </a>
          <GlowButton size="sm" variant="outline" onClick={onOpenReview}>
            <Star size={14} className="mr-1.5" /> Write a Review
          </GlowButton>
        </div>

        {/* Reviews */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold font-sora text-highlight">Reviews &amp; Feedback</h3>
            <RatingDisplay value={vendor.rating} count={vendor.reviewCount} />
          </div>
          {vendor.reviews && vendor.reviews.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {vendor.reviews.map((review, index) => (
                <div
                  key={`${review.author}-${index}`}
                  className="rounded-lg border border-glass/10 bg-white/5 p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-highlight">{review.author}</p>
                    <RatingDisplay value={review.rating || null} count={0} />
                  </div>
                  {review.comment && (
                    <p className="mt-2 text-xs text-glass">{review.comment}</p>
                  )}
                  {review.date && (
                    <p className="mt-2 text-[10px] text-glass-dim">{formatDate(review.date)}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <GlassCard className="p-5 text-center text-glass-dim text-xs">
              No reviews yet for this workshop.
            </GlassCard>
          )}
        </div>
      </div>
    </Modal>
  )
}

// ─── Main Vendors page ────────────────────────────────────────────────────────

export function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Modal state
  const [detailsVendor, setDetailsVendor] = useState<Vendor | null>(null)
  const [chatVendor, setChatVendor] = useState<Vendor | null>(null)
  const [reviewVendor, setReviewVendor] = useState<Vendor | null>(null)

  const loadVendors = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/vendors', {
        cache: 'no-store',
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      const body = await response.json().catch(() => null)
      if (!response.ok) throw new Error(body?.error || 'Unable to load registered workshops.')
      setVendors(Array.isArray(body) ? body : [])
    } catch (err) {
      setVendors([])
      setError(err instanceof Error ? err.message : 'Unable to load registered workshops.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void loadVendors() }, [loadVendors])

  function handleReviewSubmitted(updated: Vendor) {
    setVendors(prev => prev.map(v => (v.id === updated.id ? updated : v)))
    if (detailsVendor?.id === updated.id) setDetailsVendor(updated)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sora text-highlight">Registered Workshops</h1>
          <p className="text-sm text-glass-dim mt-1">Workshop owners registered on Mistry Gems platform.</p>
        </div>
        <GlowButton variant="outline" size="sm" onClick={() => void loadVendors()} loading={loading}>
          Refresh
        </GlowButton>
      </div>

      {error && <GlassCard className="p-4 text-sm text-red-300 border-red-400/30">{error}</GlassCard>}

      {loading && !vendors.length ? (
        <GlassCard className="p-8 text-center text-glass-dim">Loading registered workshops…</GlassCard>
      ) : vendors.length === 0 ? (
        <GlassCard className="p-8 text-center text-glass-dim">No registered workshops found in database.</GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {vendors.map(vendor => (
            <GlassCard key={vendor.id} className="p-5 flex flex-col gap-4">
              {/* Avatar + name */}
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-sm font-bold text-white overflow-hidden flex-shrink-0">
                  {vendor.avatar && (vendor.avatar.startsWith('http') || vendor.avatar.startsWith('/')) ? (
                    <img src={vendor.avatar} alt={vendor.name} className="w-full h-full object-cover" />
                  ) : (
                    vendor.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-bold font-sora text-highlight truncate">{vendor.name}</h2>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-glass-dim">
                    <UserCircle size={13} /> {vendor.ownerName || 'Workshop Owner'}
                  </p>
                  <div className="mt-1.5">
                    <RatingDisplay value={vendor.rating} count={vendor.reviewCount} />
                  </div>
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-1.5 text-xs text-glass">
                <p className="flex items-start gap-2">
                  <MapPin size={13} className="mt-0.5 text-[#00B4D8] flex-shrink-0" />
                  <span className="line-clamp-2">{vendor.address || 'Address not available'}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={13} className="text-[#00B4D8] flex-shrink-0" />
                  <span className="truncate">{vendor.email || 'Email not available'}</span>
                </p>
                {/* Phone number */}
                <p className="flex items-center gap-2">
                  <Phone size={13} className="text-[#00B4D8] flex-shrink-0" />
                  <a
                    href={`tel:${vendor.phone.replace(/\s/g, '')}`}
                    className="text-[#00B4D8] hover:text-white transition-colors font-medium"
                    onClick={e => e.stopPropagation()}
                  >
                    {vendor.phone}
                  </a>
                </p>
              </div>

              {/* Action buttons */}
              <div className="mt-auto pt-3 border-t border-glass/10">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Chat */}
                  <button
                    onClick={() => setChatVendor(vendor)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white hover:opacity-90 transition-opacity"
                    title="Chat with workshop"
                  >
                    <MessageCircle size={13} /> Chat
                  </button>

                  {/* Call */}
                  <a
                    href={`tel:${vendor.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#00B4D8]/40 text-[#00B4D8] hover:bg-[#00B4D8]/10 transition-colors"
                    title="Call workshop"
                  >
                    <Phone size={13} /> Call
                  </a>

                  {/* Write Review */}
                  <button
                    onClick={() => setReviewVendor(vendor)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-amber-400/40 text-amber-400 hover:bg-amber-400/10 transition-colors"
                    title="Write a review"
                  >
                    <Star size={13} /> Review
                  </button>

                  {/* View Details — pushed right */}
                  <div className="ml-auto">
                    <GlowButton size="sm" variant="outline" onClick={() => setDetailsVendor(vendor)}>
                      Details
                    </GlowButton>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {detailsVendor && (
        <DetailsModal
          vendor={detailsVendor}
          onClose={() => setDetailsVendor(null)}
          onOpenChat={() => { setDetailsVendor(null); setChatVendor(detailsVendor) }}
          onOpenReview={() => { setDetailsVendor(null); setReviewVendor(detailsVendor) }}
        />
      )}

      {/* Chat Modal — rendered outside Modal component for full-screen on mobile */}
      {chatVendor && (
        <ChatModal workshop={chatVendor} onClose={() => setChatVendor(null)} />
      )}

      {/* Write Review Modal */}
      {reviewVendor && (
        <ReviewModal
          workshop={reviewVendor}
          onClose={() => setReviewVendor(null)}
          onSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  )
}
