import React, { useRef, useState } from 'react'
import { FileText, Download, Send, Plus, Calculator, Printer, CheckCircle } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { GlassCard } from '../components/ui/GlassCard'
import { GlowButton } from '../components/ui/GlowButton'
import { useToast } from '../components/ui/Toast'
import { formatCurrency } from '../lib/utils'

export function Quotations() {
  const { customers, jobs } = useAppData()
  const { showToast } = useToast()

  const [customer, setCustomer] = useState('')
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState<number>(100)
  const [unitCost, setUnitCost] = useState<number>(450)
  const [gstRate, setGstRate] = useState<number>(18)
  const quotationRef = useRef(`QOT-${Date.now().toString().slice(-4)}`)

  const subtotal = quantity * unitCost
  const gstAmount = (subtotal * gstRate) / 100
  const grandTotal = subtotal + gstAmount

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=760')
    if (!printWindow) {
      showToast('Please allow pop-ups to print or save this quotation as PDF.', 'warning')
      return
    }

    const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character] || character))
    printWindow.document.write(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${quotationRef.current}</title><style>
      *{box-sizing:border-box} body{font-family:Arial,sans-serif;color:#172033;margin:0;background:#f4f8fb;padding:36px} .sheet{max-width:760px;margin:auto;background:#fff;padding:48px;border-radius:16px;box-shadow:0 12px 32px rgba(3,4,94,.12)} header{display:flex;justify-content:space-between;gap:24px;padding-bottom:28px;border-bottom:3px solid #0077B6} h1{margin:0;color:#03045E;font-size:28px}.brand{color:#0077B6;font-weight:700}.muted{color:#58718a;font-size:13px}.reference{text-align:right}.reference strong{color:#0077B6;font-size:18px}.section{margin-top:30px}.label{color:#58718a;font-size:12px;text-transform:uppercase;letter-spacing:.08em}.value{margin-top:6px;font-weight:600}.line{display:flex;justify-content:space-between;padding:13px 0;border-bottom:1px solid #dceaf0}.total{font-size:19px;color:#03045E;font-weight:700;border-bottom:0;padding-top:20px}.total span:last-child{color:#0077B6}.footer{margin-top:42px;padding-top:18px;border-top:1px solid #dceaf0;color:#58718a;font-size:12px}@media print{body{background:#fff;padding:0}.sheet{box-shadow:none;border-radius:0;padding:24px;max-width:none}}</style></head><body><article class="sheet"><header><div><div class="brand">MISTRY GEMS</div><h1>Quotation</h1><p class="muted">Manufacturing Workshop Platform</p></div><div class="reference"><span class="label">Quotation Reference</span><br><strong>${quotationRef.current}</strong><p class="muted">Generated ${new Date().toLocaleDateString('en-IN')}</p></div></header><section class="section"><span class="label">Prepared for</span><p class="value">${escapeHtml(customer || 'Customer to be confirmed')}</p></section><section class="section"><div class="line"><span>Description</span><strong>${escapeHtml(description || 'Manufacturing job work')}</strong></div><div class="line"><span>Quantity</span><strong>${quantity} units</strong></div><div class="line"><span>Unit Price</span><strong>${formatCurrency(unitCost)}</strong></div><div class="line"><span>Subtotal</span><strong>${formatCurrency(subtotal)}</strong></div><div class="line"><span>GST (${gstRate}%)</span><strong>${formatCurrency(gstAmount)}</strong></div><div class="line total"><span>Estimated Total</span><span>${formatCurrency(grandTotal)}</span></div></section><footer class="footer">This quotation is valid for 30 days from the date of issue. Thank you for choosing Mistry Gems.</footer></article></body></html>`)
    printWindow.document.close()
    window.setTimeout(() => {
      printWindow.focus()
      printWindow.print()
    }, 250)
    showToast('Print window opened — choose “Save as PDF” in the print dialog.', 'info')
  }

  const handleSendQuotation = () => {
    if (!customer) {
      showToast('Please select a customer first', 'warning')
      return
    }
    showToast(`Quotation sent to ${customer} via Email & WhatsApp!`, 'success')
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quotation Builder & GST Estimator</h1>
          <p className="page-subtitle">Generate accurate customer quotations with instant GST tax calculations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Controls */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold font-sora text-highlight flex items-center gap-2">
            <Calculator size={18} className="text-accent" /> Quotation Details
          </h3>

          <div>
            <label className="block text-xs font-medium text-glass-dim mb-1.5">Select Client Customer</label>
            <select className="glass-select" value={customer} onChange={e => setCustomer(e.target.value)}>
              <option value="">Select Customer</option>
              {customers.map(c => <option key={c.id} value={c.name}>{c.name} ({c.company})</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-glass-dim mb-1.5">Item / Job Description</label>
            <textarea
              className="glass-input resize-none"
              rows={3}
              placeholder="e.g. CNC Turning of SS304 Shafts with 0.02mm tolerance"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-glass-dim mb-1.5">Quantity (Units)</label>
              <input
                type="number"
                className="glass-input"
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                min={1}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-glass-dim mb-1.5">Unit Price (₹)</label>
              <input
                type="number"
                className="glass-input"
                value={unitCost}
                onChange={e => setUnitCost(Number(e.target.value))}
                min={0}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-glass-dim mb-1.5">GST Rate (%)</label>
            <select className="glass-select" value={gstRate} onChange={e => setGstRate(Number(e.target.value))}>
              <option value={5}>5% (Job Work Special)</option>
              <option value={12}>12% (Standard Job Work)</option>
              <option value={18}>18% (General Manufacturing)</option>
              <option value={28}>28% (Specialized Goods)</option>
            </select>
          </div>
        </GlassCard>

        {/* Live Preview Card */}
        <GlassCard className="p-6 flex flex-col justify-between border-glass-bright bg-white/5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-glass/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-accent">QUOTATION PREVIEW</span>
                <h3 className="text-lg font-bold text-highlight font-sora">Mistry Gems Workshop</h3>
              </div>
              <span className="text-xs font-mono text-glass-dim">Ref: {quotationRef.current}</span>
            </div>

            <div className="text-xs space-y-2 text-glass-dim">
              <div><strong className="text-glass">Client:</strong> {customer || 'Select a customer'}</div>
              <div><strong className="text-glass">Scope:</strong> {description || 'Describe scope of work...'}</div>
            </div>

            <div className="border-t border-b border-glass/10 py-4 space-y-2 text-xs">
              <div className="flex justify-between text-glass-dim">
                <span>Base Rate ({quantity} pcs @ ₹{unitCost})</span>
                <span className="font-mono">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-glass-dim">
                <span>GST Tax ({gstRate}%)</span>
                <span className="font-mono">{formatCurrency(gstAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-highlight pt-2 border-t border-glass/10">
                <span>Grand Total (Estimated)</span>
                <span className="font-mono text-emerald-400 text-base">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <GlowButton variant="outline" className="flex-1" icon={<Printer size={16} />} onClick={handleDownloadPDF}>
              Print / Save PDF
            </GlowButton>
            <GlowButton className="flex-1" icon={<Send size={16} />} onClick={handleSendQuotation}>
              Send Quotation
            </GlowButton>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
