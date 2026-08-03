import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const [employees_list] = useState(employees)

  const exportToExcel = () => {
    const data = employees_list.map(emp => ({
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
            onClick={() => navigate('/employees/add')}
            className="btn-primary text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

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
