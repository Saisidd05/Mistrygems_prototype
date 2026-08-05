import React, { useState } from 'react'
import { GlowButton } from '../ui/GlowButton'
import type { Customer } from '../../lib/data'

interface CustomerFormProps {
  initial?: Partial<Customer>
  onSubmit: (data: Omit<Customer, 'id'>) => void
  onCancel: () => void
  loading?: boolean
}

export function CustomerForm({ initial, onSubmit, onCancel, loading }: CustomerFormProps) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    company: initial?.company || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    city: initial?.city || '',
    totalJobs: initial?.totalJobs || 0,
    totalRevenue: initial?.totalRevenue || 0,
    status: initial?.status || 'Active' as 'Active' | 'Inactive',
    avatar: initial?.avatar || '',
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
          <input className="glass-input" placeholder="Ramesh Agarwal" value={form.name} onChange={e => set('name', e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Company *</label>
          <input className="glass-input" placeholder="Shree Auto Parts" value={form.company} onChange={e => set('company', e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Email</label>
          <input type="email" className="glass-input" placeholder="email@company.com" value={form.email} onChange={e => set('email', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Phone</label>
          <input className="glass-input" placeholder="+91 98000 00000" value={form.phone} onChange={e => set('phone', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-glass-dim mb-1.5">City</label>
          <input className="glass-input" placeholder="Rajkot" value={form.city} onChange={e => set('city', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Status</label>
          <select className="glass-select" value={form.status} onChange={e => set('status', e.target.value)}>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <GlowButton type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={loading}>Cancel</GlowButton>
        <GlowButton type="submit" className="flex-1" loading={loading}>{initial?.id ? 'Update Customer' : 'Add Customer'}</GlowButton>
      </div>
    </form>
  )
}
