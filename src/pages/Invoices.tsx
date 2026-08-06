import React, { useState } from 'react'
import { Receipt, Plus, Download, CheckCircle, Search } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import type { Invoice } from '../lib/data'
import { Modal } from '../components/ui/Modal'
import { jsPDF } from 'jspdf'
import { GlassCard } from '../components/ui/GlassCard'
import { GlowButton } from '../components/ui/GlowButton'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useToast } from '../components/ui/Toast'
import { formatCurrency, formatDate, downloadCSV } from '../lib/utils'

export function Invoices() {
  const { invoices, updateInvoice, addInvoice, customers, jobs } = useAppData()
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [newInvoice, setNewInvoice] = useState({ customer: '', jobId: '', amount: 0, status: 'Draft' as Invoice['status'], dueDate: '' })

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
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
    const money = `INR ${invoice.amount.toLocaleString('en-IN')}`
    pdf.setFillColor(3, 4, 94)
    pdf.rect(0, 0, 210, 42, 'F')
    pdf.setTextColor(202, 240, 248)
    pdf.setFontSize(23)
    pdf.text('MISTRY GEMS', 18, 20)
    pdf.setFontSize(10)
    pdf.text('Manufacturing Workshop Platform', 18, 28)
    pdf.setFontSize(16)
    pdf.text('INVOICE', 192, 20, { align: 'right' })
    pdf.setFontSize(10)
    pdf.text(invoice.id, 192, 28, { align: 'right' })

    const rows = [
      ['Bill To', invoice.customer], ['Job Reference', invoice.jobId], ['Issue Date', formatDate(invoice.createdAt)],
      ['Due Date', formatDate(invoice.dueDate)], ['Status', invoice.status], ['Total Amount', money],
    ]
    let y = 60
    rows.forEach(([label, value], index) => {
      pdf.setDrawColor(210, 225, 235)
      pdf.line(18, y + 8, 192, y + 8)
      pdf.setTextColor(88, 113, 138)
      pdf.setFontSize(10)
      pdf.text(label, 22, y)
      pdf.setTextColor(index === rows.length - 1 ? 0 : 23, index === rows.length - 1 ? 119 : 32, index === rows.length - 1 ? 182 : 51)
      pdf.setFontSize(index === rows.length - 1 ? 15 : 11)
      pdf.text(value, 188, y, { align: 'right' })
      y += 17
    })
    pdf.setTextColor(88, 113, 138)
    pdf.setFontSize(9)
    pdf.text('Thank you for choosing Mistry Gems.', 18, 178)
    pdf.text('This is a computer-generated invoice.', 18, 184)
    pdf.save(`${invoice.id}.pdf`)
    showToast(`${invoice.id}.pdf downloaded!`, 'success')
  }

  const handleCreateInvoice = () => {
    if (!newInvoice.customer || !newInvoice.jobId || newInvoice.amount <= 0 || !newInvoice.dueDate) {
      showToast('Please complete customer, job, amount, and due date.', 'warning')
      return
    }
    addInvoice(newInvoice)
    setNewInvoice({ customer: '', jobId: '', amount: 0, status: 'Draft', dueDate: '' })
    setCreateOpen(false)
    showToast('New invoice created successfully.', 'success')
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Invoices & Billing</h1>
          <p className="page-subtitle">Track payments, issue billing invoices, and monitor outstanding receivables.</p>
        </div>
        <div className="flex gap-2"><GlowButton size="sm" icon={<Plus size={14} />} onClick={() => setCreateOpen(true)}>Create Invoice</GlowButton><GlowButton variant="outline" size="sm" icon={<Download size={14} />} onClick={handleExport}>Export CSV</GlowButton></div>
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
            {!filtered.length && <tr><td colSpan={8} className="py-10 text-center text-glass-dim">No invoices yet. Create your first invoice.</td></tr>}
          </tbody>
        </table>
      </GlassCard>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Manual Invoice">
        <div className="grid grid-cols-2 gap-3"><label className="col-span-2 text-xs text-glass-dim">Customer<select className="glass-select mt-1" value={newInvoice.customer} onChange={event => setNewInvoice({ ...newInvoice, customer: event.target.value })}><option value="">Select customer</option>{customers.map(customer => <option key={customer.id} value={customer.company}>{customer.company}</option>)}</select></label><label className="col-span-2 text-xs text-glass-dim">Job<select className="glass-select mt-1" value={newInvoice.jobId} onChange={event => { const job = jobs.find(item => item.id === event.target.value); setNewInvoice({ ...newInvoice, jobId: event.target.value, customer: newInvoice.customer || job?.customer || '', amount: newInvoice.amount || job?.revenue || 0 }) }}><option value="">Select job</option>{jobs.map(job => <option key={job.id} value={job.id}>{job.id} — {job.description}</option>)}</select></label><label className="text-xs text-glass-dim">Amount (₹)<input type="number" min="1" className="glass-input mt-1" value={newInvoice.amount || ''} onChange={event => setNewInvoice({ ...newInvoice, amount: Number(event.target.value) })} /></label><label className="text-xs text-glass-dim">Due Date<input type="date" className="glass-input mt-1" value={newInvoice.dueDate} onChange={event => setNewInvoice({ ...newInvoice, dueDate: event.target.value })} /></label><label className="col-span-2 text-xs text-glass-dim">Status<select className="glass-select mt-1" value={newInvoice.status} onChange={event => setNewInvoice({ ...newInvoice, status: event.target.value as Invoice['status'] })}><option value="Draft">Draft</option><option value="Sent">Sent</option><option value="Paid">Paid</option><option value="Overdue">Overdue</option></select></label><GlowButton className="col-span-2" icon={<Plus size={15} />} onClick={handleCreateInvoice}>Create Invoice</GlowButton></div>
      </Modal>
    </div>
  )
}
