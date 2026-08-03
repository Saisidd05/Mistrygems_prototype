import { useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { customers } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'
import { Plus, Mail, Phone, MapPin, Download, X } from 'lucide-react'
import { motion } from 'framer-motion'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

declare module 'jspdf' {
  interface jsPDF {
    autoTable(options: any): jsPDF
  }
}

export default function Customers() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    city: '',
    totalJobs: '0',
    totalRevenue: '0',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally send to API
    console.log('New customer:', formData)
    setIsModalOpen(false)
    setFormData({ name: '', company: '', email: '', phone: '', city: '', totalJobs: '0', totalRevenue: '0' })
  }

  const exportToExcel = () => {
    const data = customers.map(c => ({
      'Company Name': c.company,
      'Contact Person': c.name,
      'Email': c.email,
      'Phone': c.phone,
      'City': c.city,
      'Total Jobs': c.totalJobs,
      'Total Revenue': c.totalRevenue,
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Customers')
    XLSX.writeFile(wb, 'customers.xlsx')
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Customer Directory', 14, 15)
    doc.setFontSize(10)
    
    const tableData = customers.map(c => [
      c.company,
      c.name,
      c.email,
      c.phone,
      c.city,
      c.totalJobs,
      `$${c.totalRevenue.toLocaleString()}`,
    ])
    
    doc.autoTable({
      head: [['Company', 'Contact', 'Email', 'Phone', 'City', 'Jobs', 'Revenue']],
      body: tableData,
      startY: 25,
      margin: 10,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
    })
    
    doc.save('customers.pdf')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Customer Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage client profiles, transaction history, and active manufacturing orders
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={exportToExcel}
            className="btn-primary text-xs bg-gradient-to-r from-green-600 to-emerald-500 hover:shadow-lg hover:shadow-green-500/30"
          >
            <Download className="w-4 h-4" />
            <span>Export XLSX</span>
          </button>
          <button 
            onClick={exportToPDF}
            className="btn-primary text-xs bg-gradient-to-r from-red-600 to-rose-500 hover:shadow-lg hover:shadow-red-500/30"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/90 backdrop-blur-xl rounded-[24px] p-6 w-full max-w-md border border-white/70 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Add New Customer</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100/70 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Contact Person"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="px-3 py-2 rounded-lg bg-white/70 border border-slate-200/70 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                  className="px-3 py-2 rounded-lg bg-white/70 border border-slate-200/70 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />
              </div>
              
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 rounded-lg bg-white/70 border border-slate-200/70 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              />
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="px-3 py-2 rounded-lg bg-white/70 border border-slate-200/70 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="px-3 py-2 rounded-lg bg-white/70 border border-slate-200/70 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-100/70 text-slate-700 font-medium text-sm hover:bg-slate-200/70 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((c) => (
          <GlassCard key={c.id} className="p-6 relative group" glow="cyan">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-cyan-500/20 flex-shrink-0">
                {c.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {c.company}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{c.name}</p>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 mt-1">
                  <MapPin className="w-3 h-3 text-cyan-500" />
                  {c.city}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/30">
                <span className="text-[10px] text-slate-400 block">Total Jobs</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {c.totalJobs} Orders
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/30">
                <span className="text-[10px] text-slate-400 block">Total Revenue</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(c.totalRevenue)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 truncate max-w-[160px]">
                <Mail className="w-3.5 h-3.5" />
                {c.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                {c.phone}
              </span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
