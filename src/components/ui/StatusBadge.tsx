import React from 'react'
import { cn } from '../../lib/utils'
import type { JobStatus, Priority, InvoiceStatus, StockStatus } from '../../lib/data'

type BadgeVariant = JobStatus | Priority | InvoiceStatus | StockStatus | 'Active' | 'Inactive' | 'On Leave'

const config: Record<string, { label?: string; classes: string }> = {
  // Job Status
  'New': { classes: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
  'Quoted': { classes: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
  'Approved': { classes: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  'Procuring': { classes: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  'In Progress': { classes: 'bg-[#00B4D8]/20 text-[#90E0EF] border-[#00B4D8]/30' },
  'Quality Check': { classes: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  'Completed': { classes: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  'Invoiced': { classes: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  // Priority
  'High': { classes: 'bg-red-500/20 text-red-300 border-red-500/30' },
  'Medium': { classes: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  'Low': { classes: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  // Invoice
  'Draft': { classes: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
  'Sent': { classes: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  'Paid': { classes: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  'Overdue': { classes: 'bg-red-500/20 text-red-300 border-red-500/30' },
  // Stock
  'OK': { classes: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  'Low Stock': { classes: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  'Out of Stock': { classes: 'bg-red-500/20 text-red-300 border-red-500/30' },
  // Employee
  'Active': { classes: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  'Inactive': { classes: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
  'On Leave': { classes: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
}

interface StatusBadgeProps {
  status: BadgeVariant | string
  dot?: boolean
  className?: string
}

export function StatusBadge({ status, dot = false, className }: StatusBadgeProps) {
  const style = config[status] || { classes: 'bg-glass/20 text-glass border-glass/20' }

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
      style.classes,
      className
    )}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />}
      {status}
    </span>
  )
}
