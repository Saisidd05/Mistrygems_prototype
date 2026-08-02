import { useState, useMemo } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { customers, jobs } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'
import { FileText, Calculator, Plus, Trash2, Send, Download, CheckCircle2 } from 'lucide-react'

export default function Quotations() {
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0].id)
  const [selectedJob, setSelectedJob] = useState(jobs[0].id)
  const [materialCost, setMaterialCost] = useState<number>(35000)
  const [labourCost, setLabourCost] = useState<number>(12000)
  const [gstRate, setGstRate] = useState<number>(5) // 5% for job work
  const [savedSuccess, setSavedSuccess] = useState(false)

  const subtotal = useMemo(() => materialCost + labourCost, [materialCost, labourCost])
  const gstAmount = useMemo(() => (subtotal * gstRate) / 100, [subtotal, gstRate])
  const totalAmount = useMemo(() => subtotal + gstAmount, [subtotal, gstAmount])

  const customerObj = customers.find((c) => c.id === selectedCustomer) || customers[0]
  const jobObj = jobs.find((j) => j.id === selectedJob) || jobs[0]

  const handleSave = () => {
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Quotation Builder
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Create professional quotations with live material, labour & GST calculation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary text-xs">
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
          <button onClick={handleSave} className="btn-primary text-xs">
            <Send className="w-4 h-4" />
            <span>Send Quotation</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Quotation saved and sent to customer successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Controls */}
        <GlassCard className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200/60 dark:border-slate-800">
            <Calculator className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Quotation Configuration
            </h2>
          </div>

          {/* Customer & Job Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                Select Customer
              </label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company} ({c.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                Select Associated Job
              </label>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.id} - {j.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cost Inputs */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Cost Breakdown Inputs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Material Cost (₹)
                </label>
                <input
                  type="number"
                  value={materialCost}
                  onChange={(e) => setMaterialCost(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Labour Cost (₹)
                </label>
                <input
                  type="number"
                  value={labourCost}
                  onChange={(e) => setLabourCost(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  GST Rate (%)
                </label>
                <select
                  value={gstRate}
                  onChange={(e) => setGstRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                >
                  <option value={5}>5% (Job Work)</option>
                  <option value={12}>12% (Standard)</option>
                  <option value={18}>18% (Manufacturing)</option>
                </select>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Live Calculation Preview Card */}
        <GlassCard className="p-6 flex flex-col justify-between border-2 border-orange-500/30">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                Live Calculation
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 font-semibold">
                QUOTE #QT-2024-042
              </span>
            </div>

            {/* Customer Summary */}
            <div className="mt-4 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/30">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {customerObj.company}
              </p>
              <p className="text-[11px] text-slate-500">{customerObj.name} • {customerObj.city}</p>
              <p className="text-[11px] text-slate-400 mt-1">Job: {jobObj.description}</p>
            </div>

            {/* Line items */}
            <div className="space-y-3 mt-6 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Material Cost</span>
                <span className="font-semibold">{formatCurrency(materialCost)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Labour Cost</span>
                <span className="font-semibold">{formatCurrency(labourCost)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex justify-between font-semibold text-slate-800 dark:text-slate-200">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-xs">
                <span>GST ({gstRate}%)</span>
                <span>{formatCurrency(gstAmount)}</span>
              </div>
            </div>
          </div>

          {/* Grand Total */}
          <div className="pt-6 border-t-2 border-dashed border-slate-200 dark:border-slate-800 mt-6">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-slate-900 dark:text-white">
                Total Amount
              </span>
              <span className="text-2xl font-extrabold text-orange-600 dark:text-orange-400">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
