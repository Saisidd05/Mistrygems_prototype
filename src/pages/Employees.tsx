import { useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { employees } from '@/lib/data'
import { Plus, Mail, Phone, Award, Download, X } from 'lucide-react'
import { motion } from 'framer-motion'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

declare module 'jspdf' {
  interface jsPDF {
    autoTable(options: any): jsPDF
  }
}

export default function Employees() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    email: '',
    phone: '',
    performance: '75',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally send to API
    console.log('New employee:', formData)
    setIsModalOpen(false)
    setFormData({ name: '', role: '', department: '', email: '', phone: '', performance: '75' })
  }

  const exportToExcel = () => {
    const data = employees.map(emp => ({
      'Employee Name': emp.name,
      'Role': emp.role,
      'Department': emp.department,
      'Email': emp.email,
      'Phone': emp.phone,
      'Status': emp.status,
      'Performance Score': emp.performance,
      'Assigned Jobs': emp.assignedJobs,
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Employees')
    XLSX.writeFile(wb, 'employees.xlsx')
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Employee Directory', 14, 15)
    doc.setFontSize(10)
    
    const tableData = employees.map(emp => [
      emp.name,
      emp.role,
      emp.department,
      emp.email,
      emp.phone,
      emp.status,
      emp.performance,
    ])
    
    doc.autoTable({
      head: [['Name', 'Role', 'Department', 'Email', 'Phone', 'Status', 'Performance']],
      body: tableData,
      startY: 25,
      margin: 10,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
    })
    
    doc.save('employees.pdf')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Employee Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Factory workforce, performance scores, and active job assignments
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
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Add Employee Modal */}
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
              <h2 className="text-xl font-bold text-slate-900">Add New Employee</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100/70 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Employee Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 rounded-lg bg-white/70 border border-slate-200/70 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              />
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="role"
                  placeholder="Role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="px-3 py-2 rounded-lg bg-white/70 border border-slate-200/70 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                  className="px-3 py-2 rounded-lg bg-white/70 border border-slate-200/70 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                >
                  <option value="">Select Department</option>
                  <option value="Production">Production</option>
                  <option value="Quality">Quality</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Logistics">Logistics</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="px-3 py-2 rounded-lg bg-white/70 border border-slate-200/70 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="px-3 py-2 rounded-lg bg-white/70 border border-slate-200/70 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Performance Score: {formData.performance}%</label>
                <input
                  type="range"
                  name="performance"
                  min="0"
                  max="100"
                  value={formData.performance}
                  onChange={handleInputChange}
                  className="w-full accent-blue-600"
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
                  Add Employee
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((emp) => (
          <GlassCard key={emp.id} className="p-6 relative group" glow="indigo">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-blue-500/20 flex-shrink-0">
                {emp.avatar}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                    {emp.name}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      emp.status === 'Active'
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {emp.status}
                  </span>
                </div>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                  {emp.role}
                </p>
                <p className="text-[11px] text-slate-400">{emp.department} Department</p>
              </div>
            </div>

            {/* Performance Bar */}
            <div className="mt-5 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  Performance Score
                </span>
                <span className="text-slate-800 dark:text-slate-200">{emp.performance}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                  style={{ width: `${emp.performance}%` }}
                />
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/30">
                <span className="text-[10px] text-slate-400 block">Assigned Jobs</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {emp.assignedJobs} Active
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/30">
                <span className="text-[10px] text-slate-400 block">Completed</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {emp.completedJobs} Jobs
                </span>
              </div>
            </div>

            {/* Contact Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 truncate max-w-[160px]">
                <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                {emp.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {emp.phone}
              </span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
