import React from 'react'
import { cn } from '../../lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  tilt?: boolean
  glow?: boolean | 'blue' | 'cyan' | 'indigo' | 'emerald' | 'amber' | 'rose'
  onClick?: () => void
  id?: string
}

export function GlassCard({ children, className, hover = true, tilt = false, glow = false, onClick, id }: GlassCardProps) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={cn(
        'glass-card',
        tilt && 'tilt-hover',
        glow && 'animate-pulse-glow',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
  color?: 'blue' | 'cyan' | 'green' | 'amber' | 'violet'
  className?: string
}

const colorMap = {
  blue: 'from-[#0077B6]/30 to-[#03045E]/20',
  cyan: 'from-[#00B4D8]/30 to-[#0077B6]/20',
  green: 'from-emerald-500/20 to-emerald-900/20',
  amber: 'from-amber-500/20 to-amber-900/20',
  violet: 'from-violet-500/20 to-violet-900/20',
}

export function StatCard({ label, value, icon, sub, trend, color = 'blue', className }: StatCardProps) {
  return (
    <div className={cn(
      'glass-card p-5 flex flex-col gap-3 hover:scale-[1.02] transition-all duration-300 cursor-default group',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className={cn(
          'feature-icon-ring bg-gradient-to-br',
          colorMap[color]
        )}>
          {icon}
        </div>
        {trend && (
          <span className={cn(
            'text-xs font-semibold px-2 py-0.5 rounded-full',
            trend === 'up' ? 'text-emerald-400 bg-emerald-400/10' :
            trend === 'down' ? 'text-red-400 bg-red-400/10' :
            'text-glass-dim bg-white/5'
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold font-sora gradient-text-bright">{value}</p>
        <p className="text-xs text-glass-dim mt-0.5">{label}</p>
        {sub && <p className="text-xs text-glass-dim mt-1">{sub}</p>}
      </div>
    </div>
  )
}
