import React from 'react'
import { Bell, CheckCheck, Trash2, ShieldAlert, Info, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { GlassCard } from '../components/ui/GlassCard'
import { GlowButton } from '../components/ui/GlowButton'
import { useToast } from '../components/ui/Toast'

export function Notifications() {
  const { notifications, markNotificationRead, markAllRead, deleteNotification } = useAppData()
  const { showToast } = useToast()

  const handleMarkAll = () => {
    markAllRead()
    showToast('All notifications marked as read.', 'success')
  }

  const handleDelete = (id: string) => {
    deleteNotification(id)
    showToast('Notification cleared.', 'info')
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications Feed</h1>
          <p className="page-subtitle">Real-time alerts, job stage transitions, and multi-channel system updates.</p>
        </div>
        <GlowButton variant="outline" size="sm" icon={<CheckCheck size={16} />} onClick={handleMarkAll}>
          Mark All Read
        </GlowButton>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <GlassCard className="p-8 text-center text-glass-dim">
            No notifications available.
          </GlassCard>
        ) : (
          notifications.map(n => (
            <GlassCard key={n.id} className={`p-4 flex items-start gap-4 ${!n.read ? 'border-accent/40 bg-white/5' : ''}`}>
              <div className="mt-1">
                {n.type === 'success' && <CheckCircle2 size={18} className="text-emerald-400" />}
                {n.type === 'warning' && <AlertTriangle size={18} className="text-amber-400" />}
                {n.type === 'error' && <ShieldAlert size={18} className="text-red-400" />}
                {n.type === 'info' && <Info size={18} className="text-[#00B4D8]" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-highlight">{n.title}</h4>
                  <span className="text-[10px] text-glass-dim">{n.time}</span>
                </div>
                <p className="text-xs text-glass mt-1">{n.message}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-white/5 text-glass-dim font-mono border border-glass/10">
                    {n.channel}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {!n.read && (
                  <button onClick={() => markNotificationRead(n.id)} className="p-1 hover:bg-white/10 rounded text-glass-dim hover:text-accent" title="Mark read">
                    <CheckCheck size={14} />
                  </button>
                )}
                <button onClick={() => handleDelete(n.id)} className="p-1 hover:bg-white/10 rounded text-glass-dim hover:text-red-400" title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  )
}
