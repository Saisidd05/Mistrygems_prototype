import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, ArrowLeft, Users, Clock } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { useToast } from '../components/ui/Toast'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Thread {
  customerId: string
  customerName: string
  lastMessage: string
  lastAt: string
  unread: number
}

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  text: string
  createdAt: string
  isSelf: boolean
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

function avatar(name: string) {
  return name.slice(0, 2).toUpperCase()
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function WorkshopChats() {
  const { showToast } = useToast()
  const [threads, setThreads] = useState<Thread[]>([])
  const [loadingThreads, setLoadingThreads] = useState(true)
  const [activeThread, setActiveThread] = useState<Thread | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // ── Load conversation threads ────────────────────────────────────────────
  const loadThreads = useCallback(async () => {
    setLoadingThreads(true)
    try {
      const res = await fetch('/api/chat?threads=1', { headers: authHeaders() })
      if (res.ok) {
        const data: Thread[] = await res.json()
        setThreads(Array.isArray(data) ? data : [])
      }
    } catch {
      // silent
    } finally {
      setLoadingThreads(false)
    }
  }, [])

  useEffect(() => { void loadThreads() }, [loadThreads])

  // ── Load messages for active thread ─────────────────────────────────────
  useEffect(() => {
    if (!activeThread) return
    let cancelled = false

    async function load() {
      setLoadingMsgs(true)
      try {
        const res = await fetch(
          `/api/chat?customerId=${encodeURIComponent(activeThread!.customerId)}`,
          { headers: authHeaders() }
        )
        if (res.ok && !cancelled) {
          const data: ChatMessage[] = await res.json()
          setMessages(Array.isArray(data) ? data : [])
          // Clear unread badge for this thread
          setThreads(prev =>
            prev.map(t => t.customerId === activeThread!.customerId ? { ...t, unread: 0 } : t)
          )
        }
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoadingMsgs(false)
      }
    }

    void load()
    return () => { cancelled = true }
  }, [activeThread])

  // ── Auto-scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Send reply ───────────────────────────────────────────────────────────
  async function handleSend() {
    if (!text.trim() || sending || !activeThread) return
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

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          receiverId: activeThread.customerId,
          receiverName: activeThread.customerName,
          text: trimmed,
        }),
      })
      if (res.ok) {
        const saved: ChatMessage = await res.json()
        setMessages(prev => prev.map(m => m.id === optimistic.id ? saved : m))
        // Update thread last message
        setThreads(prev =>
          prev.map(t =>
            t.customerId === activeThread.customerId
              ? { ...t, lastMessage: trimmed, lastAt: new Date().toISOString() }
              : t
          )
        )
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

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-6 h-full">
      <div className="mb-5">
        <h1 className="text-2xl font-bold font-sora text-highlight">Industry Chats</h1>
        <p className="text-sm text-glass-dim mt-1">Messages from industry customers about your workshop.</p>
      </div>

      <div
        className="flex rounded-2xl overflow-hidden border border-glass/10"
        style={{
          height: 'calc(100vh - 200px)',
          background: 'rgba(0,18,36,0.7)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* ── Thread list (left panel) ── */}
        <div
          className={`flex flex-col border-r border-glass/10 ${activeThread ? 'hidden sm:flex' : 'flex'} w-full sm:w-72 flex-shrink-0`}
        >
          {/* Header */}
          <div
            className="flex items-center gap-2 px-4 py-3.5 border-b border-glass/10"
            style={{ background: 'rgba(0,119,182,0.12)' }}
          >
            <Users size={16} className="text-[#00B4D8]" />
            <span className="text-sm font-semibold text-highlight">Conversations</span>
            <span className="ml-auto text-xs text-glass-dim">{threads.length}</span>
          </div>

          {/* Thread items */}
          <div className="flex-1 overflow-y-auto">
            {loadingThreads ? (
              <p className="text-center text-xs text-glass-dim py-10">Loading…</p>
            ) : threads.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-glass-dim px-4">
                <MessageCircle size={36} className="opacity-25" />
                <p className="text-xs text-center">No conversations yet.<br />Industry customers will appear here once they message you.</p>
              </div>
            ) : (
              threads.map(thread => (
                <button
                  key={thread.customerId}
                  onClick={() => setActiveThread(thread)}
                  className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors border-b border-glass/5 hover:bg-white/5 ${activeThread?.customerId === thread.customerId ? 'bg-white/8 border-l-2 border-l-[#00B4D8]' : ''}`}
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {avatar(thread.customerName)}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-semibold text-highlight truncate">{thread.customerName}</p>
                      <span className="text-[10px] text-glass-dim flex-shrink-0">{formatTime(thread.lastAt)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-[11px] text-glass-dim truncate">{thread.lastMessage || 'No messages yet'}</p>
                      {thread.unread > 0 && (
                        <span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full bg-[#00B4D8] text-[9px] font-bold flex items-center justify-center text-white">
                          {thread.unread > 9 ? '9+' : thread.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Refresh */}
          <div className="p-3 border-t border-glass/10">
            <button
              onClick={() => void loadThreads()}
              className="w-full text-xs text-glass-dim hover:text-highlight transition-colors py-1"
            >
              ↻ Refresh conversations
            </button>
          </div>
        </div>

        {/* ── Chat view (right panel) ── */}
        <div className={`flex-1 flex flex-col ${activeThread ? 'flex' : 'hidden sm:flex'}`}>
          {!activeThread ? (
            /* Empty state on desktop */
            <div className="flex flex-col items-center justify-center h-full gap-4 text-glass-dim">
              <MessageCircle size={48} className="opacity-20" />
              <p className="text-sm text-center">Select a conversation<br />to view messages</p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div
                className="flex items-center gap-3 px-4 py-3.5 border-b border-glass/10"
                style={{ background: 'rgba(0,119,182,0.12)' }}
              >
                {/* Back button (mobile only) */}
                <button
                  className="sm:hidden p-1 rounded-lg hover:bg-white/10 transition-colors text-glass-dim hover:text-highlight"
                  onClick={() => setActiveThread(null)}
                  aria-label="Back to conversations"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {avatar(activeThread.customerName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-highlight truncate">{activeThread.customerName}</p>
                  <p className="text-[11px] text-[#00B4D8]">Industry Customer</p>
                </div>
                <Clock size={14} className="text-glass-dim" />
                <span className="text-[11px] text-glass-dim">{formatTime(activeThread.lastAt)}</span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingMsgs ? (
                  <p className="text-center text-xs text-glass-dim py-8">Loading messages…</p>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-glass-dim">
                    <MessageCircle size={36} className="opacity-25" />
                    <p className="text-xs text-center">No messages yet.<br />Reply below to start the conversation.</p>
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
                className="flex items-end gap-2 p-3 border-t border-glass/10"
                style={{ background: 'rgba(0,18,36,0.5)' }}
              >
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder={`Reply to ${activeThread.customerName}… (Enter to send)`}
                  rows={1}
                  className="flex-1 resize-none rounded-xl px-3.5 py-2.5 text-sm bg-white/8 border border-glass/15 text-glass placeholder:text-glass-dim focus:outline-none focus:border-[#00B4D8]/50 transition-colors max-h-[100px]"
                  style={{ lineHeight: '1.5' }}
                />
                <button
                  onClick={() => void handleSend()}
                  disabled={!text.trim() || sending}
                  className="p-2.5 rounded-xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] text-white disabled:opacity-40 hover:opacity-90 transition-opacity flex-shrink-0"
                  aria-label="Send reply"
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
