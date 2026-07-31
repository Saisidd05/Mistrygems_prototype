import React from 'react'
import { JobStatus, Priority } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Clock, UserCheck, Play, ShieldCheck, CheckCircle2, Send, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface StatusBadgeProps {
  status: JobStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    Pending: { label: 'Pending', badgeClass: 'badge-pending', icon: Clock },
    Assigned: { label: 'Assigned', badgeClass: 'badge-assigned', icon: UserCheck },
    'In Progress': { label: 'In Progress', badgeClass: 'badge-inprogress', icon: Play },
    'Quality Check': { label: 'Quality Check', badgeClass: 'badge-quality', icon: ShieldCheck },
    Completed: { label: 'Completed', badgeClass: 'badge-completed', icon: CheckCircle2 },
    Delivered: { label: 'Delivered', badgeClass: 'badge-delivered', icon: Send },
  }

  const current = config[status] || config.Pending
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
