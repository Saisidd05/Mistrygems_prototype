import { useEffect, useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { invoices, Invoice, InvoiceStatus, jobs } from '@/lib/data'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { Receipt, Plus, FileDown, X, Send, CheckCircle2, Clock, AlertTriangle, type LucideIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import jsPDF from 'jspdf'
import { database } from '@/lib/database'

const statusConfig: Record<InvoiceStatus, { color: string; icon: LucideIcon }> = {
  Draft: {
    color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    icon: Clock,
  },
  Sent: {
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    icon: Send,
  },
  Paid: {
    color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    icon: CheckCircle2,
  },
  Overdue: {
    color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    icon: AlertTriangle,
  },
}

// ─── Generate Invoice Modal ──────────────────────────────────────────────────
function InvoiceModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (data: Omit<Invoice, 'id' | 'createdAt'>) => void | Promise<void>
}) {
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '')
  const selectedJob = jobs.find((j) => j.id === selectedJobId)
  const [amount, setAmount] = useState(selectedJob?.revenue || 0)
  const [dueDate, setDueDate] = useState('')

  const handleJobChange = (jobId: string) => {
    setSelectedJobId(jobId)
    const job = jobs.find((j) => j.id === jobId)
    if (job) setAmount(job.revenue)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave({
      jobId: selectedJobId,
      customer: selectedJob?.customer || '',
      amount,
      status: 'Draft',
      dueDate: dueDate || new Date().toISOString().split('T')[0],
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md mx-4 glass-card p-6 dark:bg-slate-900/90"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Generate Invoice</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Select Job</label>
            <select
              value={selectedJobId}
              onChange={(e) => handleJobChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>{j.id} — {j.customer}</option>
              ))}
            </select>
          </div>

          {selectedJob && (
            <div className="p-3 rounded-xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/30 text-xs">
              <p className="font-semibold text-orange-900 dark:text-orange-300">{selectedJob.description}</p>
              <p className="text-orange-700 dark:text-orange-400 mt-0.5">Customer: {selectedJob.customer}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary text-xs">Cancel</button>
            <button type="submit" className="btn-primary text-xs">Generate Invoice</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ─── Main Invoices Page ──────────────────────────────────────────────────────
export default function Invoices() {
  const [invoiceList, setInvoiceList] = useState<Invoice[]>(invoices)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    database.list<Invoice>('invoices')
      .then((storedInvoices) => {
        if (storedInvoices.length) setInvoiceList(storedInvoices)
      })
      .catch(() => undefined)
  }, [])

  const handleSaveInvoice = async (data: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newId = `INV-2024-${String(invoiceList.length + 1).padStart(3, '0')}`
    const invoice = { ...data, id: newId, createdAt: new Date().toISOString().split('T')[0] }
    try {
      await database.create('invoices', invoice)
      setInvoiceList((prev) => [...prev, invoice])
    } catch {
      // Keep the modal open so the user can try again once the database is available.
      throw new Error('Unable to save invoice')
    }
  }

  const exportInvoicePDF = (invoice: Invoice) => {
    const doc = new jsPDF()
    const amount = `INR ${invoice.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

    doc.setFillColor(234, 88, 12)
    doc.rect(0, 0, 210, 38, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.text('Mistry Gems', 14, 18)
    doc.setFontSize(10)
    doc.text('Manufacturing Invoice', 14, 27)

    doc.setTextColor(30, 41, 59)
    doc.setFontSize(16)
    doc.text('INVOICE', 14, 54)
    doc.setFontSize(11)
    doc.text(`Invoice No: ${invoice.id}`, 14, 64)
    doc.text(`Issue Date: ${invoice.createdAt ? formatDate(invoice.createdAt) : '-'}`, 14, 71)
    doc.text(`Due Date: ${invoice.dueDate ? formatDate(invoice.dueDate) : '-'}`, 14, 78)
    doc.text(`Status: ${invoice.status}`, 14, 85)

    doc.setDrawColor(226, 232, 240)
    doc.line(14, 94, 196, 94)
    doc.setFontSize(12)
    doc.text('Bill To', 14, 106)
    doc.setFontSize(11)
    doc.text(invoice.customer, 14, 114)

    doc.setFillColor(248, 250, 252)
    doc.roundedRect(14, 126, 182, 12, 2, 2, 'F')
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Description', 18, 134)
    doc.text('Amount', 190, 134, { align: 'right' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text(`Manufacturing work for job ${invoice.jobId}`, 18, 149)
    doc.text(amount, 190, 149, { align: 'right' })
    doc.line(14, 157, 196, 157)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text('Total', 135, 170)
    doc.text(amount, 190, 170, { align: 'right' })

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 116, 139)
    doc.setFontSize(9)
    doc.text('Thank you for your business.', 14, 275)
    doc.save(`${invoice.id}.pdf`)
  }

  const totalAmount = invoiceList.reduce((sum, inv) => sum + inv.amount, 0)
  const paidAmount = invoiceList.filter((i) => i.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0)
  const overdueAmount = invoiceList.filter((i) => i.status === 'Overdue').reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Invoices
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate, track, and manage manufacturing invoices
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary text-xs">
          <Plus className="w-4 h-4" />
          <span>Generate Invoice</span>
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="p-4" glow="amber">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Invoiced</span>
              <div className="p-2 rounded-xl kpi-amber">
                <Receipt className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-2">{formatCurrency(totalAmount)}</p>
          </GlassCard>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Paid</span>
              <div className="p-2 rounded-xl kpi-emerald">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-emerald-600 mt-2">{formatCurrency(paidAmount)}</p>
          </GlassCard>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Overdue</span>
              <div className="p-2 rounded-xl kpi-rose">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-red-600 mt-2">{formatCurrency(overdueAmount)}</p>
          </GlassCard>
        </motion.div>
      </div>

      {/* Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-semibold bg-slate-50/50 dark:bg-slate-800/30">
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Job ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {invoiceList.map((inv, i) => {
                const cfg = statusConfig[inv.status]
                const Icon = cfg.icon
                return (
                  <motion.tr
                    key={inv.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-orange-600 dark:text-orange-400">{inv.id}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{inv.jobId}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{inv.customer}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white">{formatCurrency(inv.amount)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border', cfg.color)}>
                        <Icon className="w-3 h-3" />
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">{formatDate(inv.dueDate)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => exportInvoicePDF(inv)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-slate-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        Export PDF
                      </button>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <InvoiceModal
            onClose={() => setShowModal(false)}
            onSave={handleSaveInvoice}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
