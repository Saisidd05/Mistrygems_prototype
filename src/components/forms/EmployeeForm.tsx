import React, { useState } from 'react'
import { GlowButton } from '../ui/GlowButton'
import type { Employee } from '../../lib/data'

interface EmployeeFormProps {
  initial?: Partial<Employee>
  onSubmit: (data: Omit<Employee, 'id'>) => void
  onCancel: () => void
  loading?: boolean
}

export function EmployeeForm({ initial, onSubmit, onCancel, loading }: EmployeeFormProps) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    role: initial?.role || '',
    department: initial?.department || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    avatar: initial?.avatar || '',
    assignedJobs: initial?.assignedJobs || 0,
    completedJobs: initial?.completedJobs || 0,
    performance: initial?.performance || 90,
    status: initial?.status || 'Active' as 'Active' | 'On Leave',
    joinDate: initial?.joinDate || new Date().toISOString().split('T')[0],
  })

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const initials = form.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    onSubmit({ ...form, avatar: initials })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Full Name *</label>
          <input className="glass-input" placeholder="Ravi Sharma" value={form.name} onChange={e => set('name', e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Role *</label>
          <input className="glass-input" placeholder="Machine Operator" value={form.role} onChange={e => set('role', e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Department *</label>
          <input className="glass-input" placeholder="CNC / Quality / Welding" value={form.department} onChange={e => set('department', e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Email</label>
          <input type="email" className="glass-input" placeholder="ravi@mistrygems.com" value={form.email} onChange={e => set('email', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Phone</label>
          <input className="glass-input" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Status</label>
          <select className="glass-select" value={form.status} onChange={e => set('status', e.target.value)}>
            <option>Active</option>
            <option>On Leave</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <GlowButton type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={loading}>Cancel</GlowButton>
        <GlowButton type="submit" className="flex-1" loading={loading}>{initial?.id ? 'Update Employee' : 'Add Employee'}</GlowButton>
      </div>
    </form>
  )
}
