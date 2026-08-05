import React, { useState } from 'react'
import { GlowButton } from '../ui/GlowButton'
import type { Job, JobStatus, Priority, JobMode } from '../../lib/data'

const statuses: JobStatus[] = ['New', 'Quoted', 'Approved', 'Procuring', 'In Progress', 'Quality Check', 'Completed', 'Invoiced']
const priorities: Priority[] = ['High', 'Medium', 'Low']
const modes: JobMode[] = ['Workshop Procures', 'Client Supplies']

interface JobFormProps {
  initial?: Partial<Job>
  onSubmit: (data: Omit<Job, 'id' | 'createdAt'>) => void
  onCancel: () => void
  loading?: boolean
  customers: string[]
  employees: string[]
}

export function JobForm({ initial, onSubmit, onCancel, loading, customers, employees }: JobFormProps) {
  const [form, setForm] = useState({
    customer: initial?.customer || '',
    description: initial?.description || '',
    priority: initial?.priority || 'Medium' as Priority,
    assignedTo: initial?.assignedTo || '',
    deadline: initial?.deadline || '',
    status: initial?.status || 'New' as JobStatus,
    revenue: initial?.revenue || 0,
    mode: initial?.mode || 'Workshop Procures' as JobMode,
  })

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Customer */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Customer *</label>
          <select className="glass-select" value={form.customer} onChange={e => set('customer', e.target.value)} required>
            <option value="">Select customer</option>
            {customers.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Job Description *</label>
          <textarea
            className="glass-input resize-none"
            rows={2}
            value={form.description}
            onChange={e => set('description', e.target.value)}
            required
            placeholder="Describe the job..."
          />
        </div>
        {/* Priority */}
        <div>
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Priority</label>
          <select className="glass-select" value={form.priority} onChange={e => set('priority', e.target.value)}>
            {priorities.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Status</label>
          <select className="glass-select" value={form.status} onChange={e => set('status', e.target.value)}>
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        {/* Assigned To */}
        <div>
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Assigned To</label>
          <select className="glass-select" value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}>
            <option value="">Select employee</option>
            {employees.map(e => <option key={e}>{e}</option>)}
          </select>
        </div>
        {/* Deadline */}
        <div>
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Deadline *</label>
          <input
            type="date"
            className="glass-input"
            value={form.deadline}
            onChange={e => set('deadline', e.target.value)}
            required
          />
        </div>
        {/* Revenue */}
        <div>
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Revenue (₹)</label>
          <input
            type="number"
            className="glass-input"
            value={form.revenue}
            onChange={e => set('revenue', Number(e.target.value))}
            min={0}
            placeholder="0"
          />
        </div>
        {/* Mode */}
        <div>
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Mode</label>
          <select className="glass-select" value={form.mode} onChange={e => set('mode', e.target.value)}>
            {modes.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <GlowButton type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={loading}>Cancel</GlowButton>
        <GlowButton type="submit" className="flex-1" loading={loading}>{initial?.id ? 'Update Job' : 'Create Job'}</GlowButton>
      </div>
    </form>
  )
}
