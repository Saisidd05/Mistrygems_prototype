import React from 'react'
import { JobStatus, Priority, JobMode } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Clock, UserCheck, Play, ShieldCheck, CheckCircle2, Send, FileText, Package, Tag, CircleDot, Truck } from 'lucide-react'

interface StatusBadgeProps {
  status: JobStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config: Record<JobStatus, { label: string; badgeClass: string; icon: any }> = {
    New: { label: 'New', badgeClass: 'badge-new', icon: CircleDot },
    Quoted: { label: 'Quoted', badgeClass: 'badge-quoted', icon: FileText },
    Approved: { label: 'Approved', badgeClass: 'badge-approved', icon: CheckCircle2 },
    Procuring: { label: 'Procuring', badgeClass: 'badge-procuring', icon: Package },
    'In Progress': { label: 'In Progress', badgeClass: 'badge-inprogress', icon: Play },
    'Quality Check': { label: 'Quality Check', badgeClass: 'badge-quality', icon: ShieldCheck },
    Completed: { label: 'Completed', badgeClass: 'badge-completed', icon: CheckCircle2 },
    Invoiced: { label: 'Invoiced', badgeClass: 'badge-invoiced', icon: Tag },
  }

  const current = config[status] || config.New
  const Icon = current.icon

  return (
    <span className={cn(current.badgeClass, className)}>
      <Icon className="w-3.5 h-3.5" />
      <span>{current.label}</span>
    </span>
  )
}

interface PriorityBadgeProps {
  priority: Priority
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = {
    High: { label: 'High', class: 'priority-high' },
    Medium: { label: 'Medium', class: 'priority-medium' },
    Low: { label: 'Low', class: 'priority-low' },
  }

  const current = config[priority] || config.Medium

  return (
    <span className={cn(current.class, className)}>
      {current.label}
    </span>
  )
}

interface ModeBadgeProps {
  mode: JobMode
  className?: string
}

export function ModeBadge({ mode, className }: ModeBadgeProps) {
  const isWorkshop = mode === 'Workshop Procures'

  return (
    <span className={cn(
      isWorkshop ? 'badge-mode-workshop' : 'badge-mode-client',
      className
    )}>
      {isWorkshop ? (
        <>
          <Package className="w-3 h-3" />
          <span>Workshop Procures</span>
        </>
      ) : (
        <>
          <Truck className="w-3 h-3" />
          <span>Client Supplies</span>
        </>
      )}
    </span>
  )
}
