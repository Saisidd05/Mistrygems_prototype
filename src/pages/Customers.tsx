import React, { useState } from 'react'
import { Users, Plus, Search, Mail, Phone, MapPin, Edit2, Trash2, Building } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { GlassCard } from '../components/ui/GlassCard'
import { GlowButton } from '../components/ui/GlowButton'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { CustomerForm } from '../components/forms/CustomerForm'
import { useToast } from '../components/ui/Toast'
import { formatCurrency } from '../lib/utils'
import type { Customer } from '../lib/data'

export function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useAppData()
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  )

  const handleFormSubmit = (data: Omit<Customer, 'id'>) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, data)
      showToast(`Customer ${data.name} updated successfully!`, 'success')
    } else {
      addCustomer(data)
      showToast('New customer added successfully!', 'success')
    }
    setOpenModal(false)
    setEditingCustomer(null)
  }

  const handleDelete = () => {
    if (deletingId) {
      deleteCustomer(deletingId)
      showToast('Customer deleted.', 'warning')
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Management</h1>
          <p className="page-subtitle">Directory of client companies, project histories, and contact profiles.</p>
        </div>
        <GlowButton size="sm" icon={<Plus size={16} />} onClick={() => { setEditingCustomer(null); setOpenModal(true); }}>
          Add Customer
        </GlowButton>
      </div>

      {/* Search */}
      <GlassCard className="p-4">
        <div className="relative max-w-md">
          <input
            className="glass-input pl-10"
            placeholder="Search by name, company or city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-glass-dim" />
        </div>
      </GlassCard>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(cust => (
          <GlassCard key={cust.id} className="p-5 flex flex-col justify-between hover:border-accent/40">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center font-bold text-white shadow-glow-sm">
                    {cust.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-highlight">{cust.name}</h3>
                    <p className="text-xs text-glass-dim flex items-center gap-1">
                      <Building size={12} /> {cust.company}
                    </p>
                  </div>
                </div>
                <StatusBadge status={cust.status} />
              </div>

              <div className="space-y-2 text-xs text-glass-dim border-t border-b border-glass/10 py-3 mb-4">
                {cust.email && <div className="flex items-center gap-2"><Mail size={13} className="text-accent" /> {cust.email}</div>}
                {cust.phone && <div className="flex items-center gap-2"><Phone size={13} className="text-accent" /> {cust.phone}</div>}
                {cust.city && <div className="flex items-center gap-2"><MapPin size={13} className="text-accent" /> {cust.city}</div>}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <div className="p-2 rounded-lg bg-white/5 text-center">
                  <span className="text-[10px] text-glass-dim block">Total Jobs</span>
                  <span className="text-sm font-bold text-highlight">{cust.totalJobs}</span>
                </div>
                <div className="p-2 rounded-lg bg-white/5 text-center">
                  <span className="text-[10px] text-glass-dim block">Total Revenue</span>
                  <span className="text-xs font-bold text-emerald-400">{formatCurrency(cust.totalRevenue)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-glass/10">
              <button onClick={() => { setEditingCustomer(cust); setOpenModal(true); }} className="p-1.5 hover:bg-white/10 rounded-lg text-glass-dim hover:text-accent">
                <Edit2 size={14} />
              </button>
              <button onClick={() => setDeletingId(cust.id)} className="p-1.5 hover:bg-white/10 rounded-lg text-glass-dim hover:text-red-400">
                <Trash2 size={14} />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Modal */}
      <Modal open={openModal} onClose={() => { setOpenModal(false); setEditingCustomer(null); }} title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}>
        <CustomerForm
          initial={editingCustomer || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => { setOpenModal(false); setEditingCustomer(null); }}
        />
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message="Are you sure you want to delete this customer profile?"
      />
    </div>
  )
}
