import React, { useState } from 'react'
import { Receipt, Plus, Download, CheckCircle, Search } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import type { Invoice } from '../lib/data'
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

  const handleDownloadInvoice = (invoice: Invoice) => {
    const invoiceDocument = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${invoice.id}</title>
<style>body{font-family:Arial,sans-serif;color:#0f172a;margin:48px;max-width:720px}header{display:flex;justify-content:space-between;border-bottom:2px solid #0077B6;padding-bottom:24px}h1{color:#0077B6;margin:0}.muted{color:#64748b}.card{margin-top:28px;padding:24px;background:#f8fafc;border-radius:12px}.row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #e2e8f0}.total{font-size:22px;font-weight:700;color:#0077B6;border:0}@media print{body{margin:24px}}</style>
</head><body><header><div><h1>Mistry Gems</h1><p class="muted">Manufacturing Workshop Platform</p></div><div><strong>INVOICE</strong><p>${invoice.id}</p></div></header>
<section class="card"><div class="row"><span>Bill To</span><strong>${invoice.customer}</strong></div><div class="row"><span>Job Reference</span><strong>${invoice.jobId}</strong></div><div class="row"><span>Issued</span><strong>${formatDate(invoice.createdAt)}</strong></div><div class="row"><span>Due Date</span><strong>${formatDate(invoice.dueDate)}</strong></div><div class="row"><span>Status</span><strong>${invoice.status}</strong></div><div class="row total"><span>Total Amount</span><span>${formatCurrency(invoice.amount)}</span></div></section>
<p class="muted" style="margin-top:32px">Thank you for choosing Mistry Gems.</p></body></html>`
    const url = URL.createObjectURL(new Blob([invoiceDocument], { type: 'text/html;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${invoice.id}.html`
    link.click()
    URL.revokeObjectURL(url)
    showToast(`${invoice.id} downloaded!`, 'success')
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
                  <GlowButton size="sm" variant="ghost" className="mr-1 text-xs text-accent" icon={<Download size={13} />} onClick={() => handleDownloadInvoice(inv)}>
                    Download
                  </GlowButton>
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
