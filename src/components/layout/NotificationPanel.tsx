import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Send, X, ChevronRight } from 'lucide-react'
import { getAccountType, useAuth } from '../../context/AuthContext'

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
}

interface Thread {
  id: string
  name: string
  lastMessage: string
  lastAt: string
  unread: number
  /** For workshop: customerId; for industry: workshopId */
  peerId: string
}

interface Props {
  onClose: () => void
}

export function NotificationPanel({ onClose }: Props) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const panelRef = useRef<HTMLDivElement>(null)
  const isIndustry = getAccountType(user) === 'industry'

  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)

  // Quick-reply state
  const [replyingTo, setReplyingTo] = useState<Thread | null>(null)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  // Load threads
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/chat?threads=1', { headers: authHeaders() })
        if (res.ok && !cancelled) {
          const data = await res.json()
          if (!Array.isArray(data)) return
          const mapped: Thread[] = data.map((t: Record<string, unknown>) => ({
            id: String(t.workshopId ?? t.customerId ?? ''),
            name: String(t.workshopName ?? t.customerName ?? 'Unknown'),
            lastMessage: String(t.lastMessage ?? ''),
            lastAt: String(t.lastAt ?? ''),
            unread: Number(t.unread ?? 0),
            peerId: String(t.workshopId ?? t.customerId ?? ''),
          }))
          // Sort: unread first, then most recent
          mapped.sort((a, b) => {
            if (b.unread !== a.unread) return b.unread - a.unread
            return new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime()
          })
          setThreads(mapped)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    const timer = window.setInterval(load, 3000)
    return () => { cancelled = true; window.clearInterval(timer) }
  }, [])

  function formatTime(iso: string) {
    if (!iso) return ''
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHrs = Math.floor(diffMins / 60)
    if (diffHrs < 24) return `${diffHrs}h ago`
    return d.toLocaleDateString()
  }

  function openChat(thread: Thread) {
    if (isIndustry) {
      navigate(`/industry/chats?workshopId=${encodeURIComponent(thread.peerId)}&workshopName=${encodeURIComponent(thread.name)}`)
    } else {
      navigate(`/workshop/chats?customerId=${encodeURIComponent(thread.peerId)}&customerName=${encodeURIComponent(thread.name)}`)
    }
    onClose()
  }

  async function sendReply() {
    if (!replyText.trim() || sending || !replyingTo) return
    setSending(true)
    const trimmed = replyText.trim()
    setReplyText('')
    try {
      const body = isIndustry
        ? { workshopId: replyingTo.peerId, workshopName: replyingTo.name, text: trimmed }
        : { receiverId: replyingTo.peerId, receiverName: replyingTo.name, text: trimmed }
      await fetch('/api/chat', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(body),
      })
      setReplyingTo(null)
    } catch {
      // silent
    } finally {
      setSending(false)
    }
  }

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-80 z-50 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
      style={{ background: 'rgba(10,20,40,0.97)', backdropFilter: 'blur(20px)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <MessageCircle size={15} className="text-[#00B4D8]" />
          <span className="text-sm font-semibold text-white">Recent Chats</span>
          {threads.some(t => t.unread > 0) && (
            <span className="text-[10px] bg-[#00B4D8] text-black font-bold px-1.5 py-0.5 rounded-full">
              {threads.reduce((acc, t) => acc + t.unread, 0)} new
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
          <X size={14} />
        </button>
      </div>

      {/* Body */}
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <p className="text-center text-xs text-white/40 py-8">Loading…</p>
        ) : threads.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-white/30">
            <MessageCircle size={28} className="opacity-40" />
            <p className="text-xs">No conversations yet</p>
          </div>
        ) : (
          threads.map(thread => (
            <div key={thread.id} className="border-b border-white/5 last:border-none">
              {/* Thread row */}
              <div className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {thread.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0" onClick={() => openChat(thread)} style={{ cursor: 'pointer' }}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold truncate ${thread.unread > 0 ? 'text-white' : 'text-white/70'}`}>
                      {thread.name}
                    </span>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      {thread.unread > 0 && (
                        <span className="w-4 h-4 rounded-full bg-[#00B4D8] text-black text-[9px] font-bold flex items-center justify-center">
                          {thread.unread > 9 ? '9+' : thread.unread}
                        </span>
                      )}
                      <span className="text-[10px] text-white/30">{formatTime(thread.lastAt)}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-white/40 truncate mt-0.5">{thread.lastMessage}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setReplyingTo(replyingTo?.id === thread.id ? null : thread)}
                    title="Quick reply"
                    className={`p-1 rounded-lg transition-all text-xs ${replyingTo?.id === thread.id ? 'bg-[#00B4D8]/20 text-[#00B4D8]' : 'text-white/30 hover:text-[#00B4D8] hover:bg-white/5'}`}
                  >
                    <Send size={13} />
                  </button>
                  <button
                    onClick={() => openChat(thread)}
                    title="Open chat"
                    className="p-1 rounded-lg text-white/20 hover:text-white/70 hover:bg-white/5 transition-all"
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>

              {/* Quick reply box */}
              {replyingTo?.id === thread.id && (
                <div className="px-4 pb-3 flex gap-2 items-end">
                  <textarea
                    autoFocus
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void sendReply() }
                      if (e.key === 'Escape') setReplyingTo(null)
                    }}
                    placeholder={`Reply to ${thread.name}…`}
                    rows={2}
                    className="flex-1 resize-none rounded-xl px-3 py-2 text-xs text-black bg-white/90 placeholder:text-black/40 outline-none focus:ring-1 focus:ring-[#00B4D8]/50"
                  />
                  <button
                    onClick={() => void sendReply()}
                    disabled={sending || !replyText.trim()}
                    className="p-2 rounded-xl bg-[#00B4D8] text-black disabled:opacity-40 hover:bg-[#0096C7] transition-all flex-shrink-0"
                  >
                    <Send size={14} />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {threads.length > 0 && (
        <div className="px-4 py-2.5 border-t border-white/10">
          <button
            onClick={() => { navigate(isIndustry ? '/industry/chats' : '/workshop/chats'); onClose() }}
            className="text-[11px] text-[#00B4D8] hover:text-[#0096C7] transition-colors w-full text-center"
          >
            View all chats →
          </button>
        </div>
      )}
    </div>
  )
}
