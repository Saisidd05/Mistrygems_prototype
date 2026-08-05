import React, { useState } from 'react'
import { Receipt, Plus, Download, Printer, CheckCircle, Search } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { GlassCard } from '../components/ui/GlassCard'
import { GlowButton } from '../components/ui/GlowButton'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useToast } from '../components/ui/Toast'
import { formatCurrency, formatDate, downloadCSV } from '../lib/utils'

export function Invoices() {
  const { invoices, updateInvoice } = useAppData()
  const { showToast } = useToast()

  const [search, setSearch] = useState('')

  const filtered = invoices.filter(inv =>
    inv.id.toLowerCase().includes(search.toLowerCase()) ||
    inv.customer.toLowerCase().includes(search.toLowerCase()) ||
    inv.jobId.toLowerCase().includes(search.toLowerCase())
  )

  const handleMarkPaid = (id: string) => {
    updateInvoice(id, { status: 'Paid' })
    showToast(`Invoice ${id} marked as Paid!`, 'success')
  }

  const handleExport = () => {
    downloadCSV(filtered as unknown as Record<string, unknown>[], 'mistry_gems_invoices')
    showToast('Exported invoices to CSV!', 'info')
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Invoices & Billing</h1>
          <p className="page-subtitle">Track payments, issue billing invoices, and monitor outstanding receivables.</p>
        </div>
        <GlowButton variant="outline" size="sm" icon={<Download size={14} />} onClick={handleExport}>
          Export CSV
        </GlowButton>
      </div>

      <GlassCard className="p-4">
        <div className="relative max-w-md">
          <input
            className="glass-input pl-10"
            placeholder="Search invoice ID, customer, job ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-glass-dim" />
        </div>
      </GlassCard>

      <GlassCard className="p-4 overflow-x-auto">
        <table className="glass-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Job ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => (
              <tr key={inv.id}>
                <td className="font-mono text-xs text-accent font-semibold">{inv.id}</td>
                <td className="font-mono text-xs text-glass-dim">{inv.jobId}</td>
                <td className="text-highlight font-medium">{inv.customer}</td>
                <td className="font-semibold text-highlight">{formatCurrency(inv.amount)}</td>
                <td><StatusBadge status={inv.status} dot /></td>
                <td className="text-xs">{formatDate(inv.createdAt)}</td>
                <td className="text-xs">{formatDate(inv.dueDate)}</td>
                <td className="text-right">
                  {inv.status !== 'Paid' && (
                    <GlowButton size="sm" variant="ghost" className="text-xs text-emerald-400" onClick={() => handleMarkPaid(inv.id)}>
                      Mark Paid
                    </GlowButton>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  )
}
