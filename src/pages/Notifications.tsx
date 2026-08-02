import { useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { notifications as initialNotifications, Notification } from '@/lib/data'
import { Bell, CheckCircle2, AlertTriangle, Info, AlertCircle, Check, MessageCircle, Smartphone, type LucideIcon } from 'lucide-react'

const channelConfig: Record<string, { icon: LucideIcon; color: string; label: string }> = {
  whatsapp: { icon: MessageCircle, color: 'text-emerald-500', label: 'WhatsApp' },
  sms: { icon: Smartphone, color: 'text-blue-500', label: 'SMS' },
  'in-app': { icon: Bell, color: 'text-slate-400', label: 'In-App' },
}

export default function Notifications() {
  const [items, setItems] = useState<Notification[]>(initialNotifications)

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const groups: Array<Notification['group']> = ['Today', 'Yesterday', 'Older']

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Notification Center
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            System alerts, job status changes, and team updates
          </p>
        </div>
        <button onClick={markAllRead} className="btn-secondary text-xs">
          <Check className="w-4 h-4" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Grouped Notifications */}
      <div className="space-y-6">
        {groups.map((group) => {
          const groupItems = items.filter((n) => n.group === group)
          if (groupItems.length === 0) return null

          return (
            <div key={group} className="space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                {group}
              </h2>
              <div className="space-y-2.5">
                {groupItems.map((n) => {
                  const channel = channelConfig[n.channel] || channelConfig['in-app']
                  const ChannelIcon = channel.icon

                  return (
                    <GlassCard
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`p-4 cursor-pointer transition-all ${
                        !n.read
                          ? 'border-l-4 border-l-orange-500 bg-orange-50/20 dark:bg-orange-950/10'
                          : 'opacity-80'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="mt-0.5 flex-shrink-0">{getIcon(n.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h3
                                className={`text-sm font-bold ${
                                  !n.read
                                    ? 'text-slate-900 dark:text-white'
                                    : 'text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {n.title}
                              </h3>
                              {/* Channel Badge */}
                              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${channel.color}`}>
                                <ChannelIcon className="w-3 h-3" />
                                {channel.label}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 flex-shrink-0">{n.time}</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
