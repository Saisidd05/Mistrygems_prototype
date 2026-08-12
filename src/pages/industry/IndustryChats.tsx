import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, ArrowLeft, Building2, Clock, RefreshCw } from 'lucide-react'
import { useToast } from '../../components/ui/Toast'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Workshop {
  id: string
  name: string
  phone: string
  email: string
}

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  text: string
  createdAt: string
  isSelf: boolean
}

interface ChatThread {
  workshopId: string
  workshopName: string
  lastMessage: string
  lastAt: string
  unread: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getToken() {
  const saved = localStorage.getItem('mistry-auth')
  return saved ? (JSON.parse(saved)?.token ?? '') : ''
}

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' }
}

function formatTime(value: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  if (diff < 86400000) return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase() || name.slice(0, 2).toUpperCase()
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function IndustryChats() {
  const { showToast } = useToast()

  // All workshops this industry user has previously chatted with (fetched from vendors + messages)
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loadingWorkshops, setLoadingWorkshops] = useState(true)

  // Active conversation
  const [activeWorkshop, setActiveWorkshop] = useState<Workshop | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loadingMsgs, setLoadingMsgs] = useState(false)

  // Track last message per workshop for preview
  const [lastMessages, setLastMessages] = useState<Record<string, { text: string; at: string }>>({})

  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // ── Load all workshops (vendors list) ────────────────────────────────────
  const loadWorkshops = useCallback(async () => {
    setLoadingWorkshops(true)
    try {
      const [vendorsRes, threadsRes] = await Promise.all([
        fetch('/api/vendors', { headers: authHeaders() }),
        fetch('/api/chat?threads=1', { headers: authHeaders() }),
      ])
      const vendors: Workshop[] = vendorsRes.ok ? await vendorsRes.json() : []
      const threads: ChatThread[] = threadsRes.ok ? await threadsRes.json() : []
      const safeVendors = Array.isArray(vendors) ? vendors : []
      const safeThreads = Array.isArray(threads) ? threads : []
      const vendorIds = new Set(safeVendors.map(workshop => workshop.id))
      const threadOnlyWorkshops = safeThreads
        .filter(thread => !vendorIds.has(thread.workshopId))
        .map(thread => ({ id: thread.workshopId, name: thread.workshopName || 'Workshop', phone: '', email: '' }))

      setWorkshops([...safeVendors, ...threadOnlyWorkshops])
      setLastMessages(Object.fromEntries(
        safeThreads.map(thread => [thread.workshopId, { text: thread.lastMessage, at: thread.lastAt }])
      ))
    } catch {
      // silent
    } finally {
      setLoadingWorkshops(false)
    }
  }, [])

  useEffect(() => { void loadWorkshops() }, [loadWorkshops])

  // ── Load messages for active workshop ────────────────────────────────────
  useEffect(() => {
    if (!activeWorkshop) return
    let cancelled = false

    async function load() {
      setLoadingMsgs(true)
      try {
        const res = await fetch(
          `/api/chat?workshopId=${encodeURIComponent(activeWorkshop!.id)}`,
          { headers: authHeaders() }
        )
        if (res.ok && !cancelled) {
          const data: ChatMessage[] = await res.json()
          const msgs = Array.isArray(data) ? data : []
          setMessages(msgs)
          // Update preview
          if (msgs.length > 0) {
            const last = msgs[msgs.length - 1]
            setLastMessages(prev => ({
              ...prev,
              [activeWorkshop!.id]: { text: last.text, at: last.createdAt },
            }))
          }
        }
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoadingMsgs(false)
      }
    }

    void load()
    return () => { cancelled = true }
  }, [activeWorkshop])

  // ── Auto-scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Send message ─────────────────────────────────────────────────────────
  async function handleSend() {
    if (!text.trim() || sending || !activeWorkshop) return
    setSending(true)
    const trimmed = text.trim()
    setText('')

    const optimistic: ChatMessage = {
      id: `opt-${Date.now()}`,
      senderId: 'me',
      senderName: 'You',
      text: trimmed,
      createdAt: new Date().toISOString(),
      isSelf: true,
    }
    setMessages(prev => [...prev, optimistic])
    setLastMessages(prev => ({
      ...prev,
      [activeWorkshop.id]: { text: trimmed, at: new Date().toISOString() },
    }))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ workshopId: activeWorkshop.id, workshopName: activeWorkshop.name, text: trimmed }),
      })
      if (res.ok) {
        const saved: ChatMessage = await res.json()
        setMessages(prev => prev.map(m => m.id === optimistic.id ? saved : m))
      } else {
        showToast('Failed to send message.', 'error')
      }
    } catch {
      showToast('Network error. Please try again.', 'error')
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

  // Workshops that have chat history show first
  const sortedWorkshops = [...workshops].sort((a, b) => {
    const aAt = lastMessages[a.id]?.at ?? ''
    const bAt = lastMessages[b.id]?.at ?? ''
    if (aAt && bAt) return bAt.localeCompare(aAt)
    if (aAt) return -1
    if (bAt) return 1
    return 0
  })

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-6 h-full">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-sora text-highlight">Workshop Chats</h1>
          <p className="text-sm text-glass-dim mt-1">Chat with registered workshops directly.</p>
        </div>
        <button
          onClick={() => void loadWorkshops()}
          className="flex items-center gap-1.5 text-xs text-glass-dim hover:text-highlight transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div
        className="flex rounded-2xl overflow-hidden border border-glass/10"
        style={{
          height: 'calc(100vh - 210px)',
          background: 'rgba(0,18,36,0.7)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* ── Left: Workshop list ── */}
        <div
          className={`flex flex-col border-r border-glass/10 ${activeWorkshop ? 'hidden sm:flex' : 'flex'} w-full sm:w-72 flex-shrink-0`}
        >
          {/* Panel header */}
          <div
            className="flex items-center gap-2 px-4 py-3.5 border-b border-glass/10"
            style={{ background: 'rgba(0,119,182,0.12)' }}
          >
            <Building2 size={15} className="text-[#00B4D8]" />
            <span className="text-sm font-semibold text-highlight">Workshops</span>
            <span className="ml-auto text-xs text-glass-dim">{workshops.length}</span>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loadingWorkshops ? (
              <p className="text-center text-xs text-glass-dim py-10">Loading workshops…</p>
            ) : sortedWorkshops.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-glass-dim px-4">
                <Building2 size={36} className="opacity-25" />
                <p className="text-xs text-center">No registered workshops found.</p>
              </div>
            ) : (
              sortedWorkshops.map(ws => {
                const preview = lastMessages[ws.id]
                const isActive = activeWorkshop?.id === ws.id
                return (
                  <button
                    key={ws.id}
                    onClick={() => { setActiveWorkshop(ws); setMessages([]) }}
                    className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors border-b border-glass/5 hover:bg-white/5 ${isActive ? 'bg-white/8 border-l-2 border-l-[#00B4D8]' : ''}`}
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {initials(ws.name)}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-semibold text-highlight truncate">{ws.name}</p>
                        {preview && (
                          <span className="text-[10px] text-glass-dim flex-shrink-0">{formatTime(preview.at)}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-glass-dim truncate mt-0.5">
                        {preview ? preview.text : 'Tap to start chatting'}
                      </p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* ── Right: Chat view ── */}
        <div className={`flex-1 flex flex-col min-w-0 ${activeWorkshop ? 'flex' : 'hidden sm:flex'}`}>
          {!activeWorkshop ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full gap-4 text-glass-dim">
              <MessageCircle size={52} className="opacity-20" />
              <div className="text-center">
                <p className="text-sm font-medium text-highlight">Select a workshop</p>
                <p className="text-xs mt-1">Choose any workshop from the left to start chatting</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div
                className="flex items-center gap-3 px-4 py-3.5 border-b border-glass/10 flex-shrink-0"
                style={{ background: 'rgba(0,119,182,0.12)' }}
              >
                {/* Back (mobile) */}
                <button
                  className="sm:hidden p-1 rounded-lg hover:bg-white/10 transition-colors text-glass-dim hover:text-highlight"
                  onClick={() => setActiveWorkshop(null)}
                  aria-label="Back"
                >
                  <ArrowLeft size={18} />
                </button>

                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {initials(activeWorkshop.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-highlight truncate">{activeWorkshop.name}</p>
                  <p className="text-[11px] text-[#00B4D8]">Workshop</p>
                </div>
                {lastMessages[activeWorkshop.id] && (
                  <div className="flex items-center gap-1 text-glass-dim">
                    <Clock size={12} />
                    <span className="text-[11px]">{formatTime(lastMessages[activeWorkshop.id].at)}</span>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingMsgs ? (
                  <p className="text-center text-xs text-glass-dim py-10">Loading messages…</p>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-glass-dim">
                    <MessageCircle size={40} className="opacity-25" />
                    <p className="text-xs text-center">
                      No messages yet with <span className="text-highlight">{activeWorkshop.name}</span>.<br />
                      Say hi below!
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
                      <p className="text-[10px] text-glass-dim mt-1 mx-1">{formatTime(msg.createdAt)}</p>
                    </div>
                  ))
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div
                className="flex items-end gap-2 p-3 border-t border-glass/10 flex-shrink-0"
                style={{ background: 'rgba(0,18,36,0.5)' }}
              >
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder={`Message ${activeWorkshop.name}… (Enter to send)`}
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}
