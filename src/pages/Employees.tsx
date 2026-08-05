import React, { useState } from 'react'
import { UserCheck, Plus, Search, Mail, Phone, Award, Edit2, Trash2, Calendar, Briefcase } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { GlassCard } from '../components/ui/GlassCard'
import { GlowButton } from '../components/ui/GlowButton'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmployeeForm } from '../components/forms/EmployeeForm'
import { useToast } from '../components/ui/Toast'
import { formatDate } from '../lib/utils'
import type { Employee } from '../lib/data'

export function Employees() {
  const { employees, addEmployee, updateEmployee, deleteEmployee, jobs } = useAppData()
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null)

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  )

  const handleFormSubmit = (data: Omit<Employee, 'id'>) => {
    if (editingEmp) {
      updateEmployee(editingEmp.id, data)
      showToast(`Employee ${data.name} updated successfully!`, 'success')
    } else {
      addEmployee(data)
      showToast('New employee added successfully!', 'success')
    }
    setOpenModal(false)
    setEditingEmp(null)
  }

  const handleDelete = () => {
    if (deletingId) {
      deleteEmployee(deletingId)
      showToast('Employee record deleted.', 'warning')
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Workforce & Team</h1>
          <p className="page-subtitle">Manage machine operators, department leads, and production staff.</p>
        </div>
        <GlowButton size="sm" icon={<Plus size={16} />} onClick={() => { setEditingEmp(null); setOpenModal(true); }}>
          Add Employee
        </GlowButton>
      </div>

      <GlassCard className="p-4">
        <div className="relative max-w-md">
          <input
            className="glass-input pl-10"
            placeholder="Search by name, role or department..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-glass-dim" />
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(emp => {
          const empJobs = jobs.filter(j => j.assignedTo === emp.name)
          return (
            <GlassCard key={emp.id} className="p-5 flex flex-col justify-between hover:border-accent/40">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center font-bold text-white shadow-glow-sm">
                      {emp.avatar}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-highlight">{emp.name}</h3>
                      <p className="text-xs text-accent font-medium">{emp.role}</p>
                    </div>
                  </div>
                  <StatusBadge status={emp.status} />
                </div>

                <div className="space-y-1.5 text-xs text-glass-dim border-t border-b border-glass/10 py-3 mb-4">
                  <div>Department: <span className="text-glass font-medium">{emp.department}</span></div>
                  {emp.email && <div className="flex items-center gap-2"><Mail size={12} className="text-accent" /> {emp.email}</div>}
                  {emp.phone && <div className="flex items-center gap-2"><Phone size={12} className="text-accent" /> {emp.phone}</div>}
                  <div className="flex items-center gap-2"><Calendar size={12} className="text-accent" /> Joined: {formatDate(emp.joinDate)}</div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                  <div className="p-2 rounded-lg bg-white/5 text-center">
                    <span className="text-[10px] text-glass-dim block">Assigned</span>
                    <span className="text-xs font-bold text-highlight">{empJobs.length}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 text-center">
                    <span className="text-[10px] text-glass-dim block">Completed</span>
                    <span className="text-xs font-bold text-emerald-400">{emp.completedJobs}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 text-center">
                    <span className="text-[10px] text-glass-dim block">Score</span>
                    <span className="text-xs font-bold text-accent">{emp.performance}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-glass/10">
                <button onClick={() => setSelectedEmp(emp)} className="p-1.5 hover:bg-white/10 rounded-lg text-glass-dim hover:text-highlight" title="View Details">
                  <Briefcase size={14} />
                </button>
                <button onClick={() => { setEditingEmp(emp); setOpenModal(true); }} className="p-1.5 hover:bg-white/10 rounded-lg text-glass-dim hover:text-accent">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => setDeletingId(emp.id)} className="p-1.5 hover:bg-white/10 rounded-lg text-glass-dim hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </GlassCard>
          )
        })}
      </div>

      <Modal open={openModal} onClose={() => { setOpenModal(false); setEditingEmp(null); }} title={editingEmp ? 'Edit Employee' : 'Add New Employee'}>
        <EmployeeForm
          initial={editingEmp || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => { setOpenModal(false); setEditingEmp(null); }}
        />
      </Modal>

      <ConfirmDialog
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Employee"
        message="Are you sure you want to remove this employee record?"
      />

      {/* Employee Detail Modal */}
      <Modal open={!!selectedEmp} onClose={() => setSelectedEmp(null)} title={`Employee Profile: ${selectedEmp?.name}`}>
        {selectedEmp && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-white/5 border border-glass/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-highlight">{selectedEmp.name}</span>
                <StatusBadge status={selectedEmp.status} />
              </div>
              <p className="text-glass-dim">{selectedEmp.role} — {selectedEmp.department} Dept</p>
            </div>
            <div>
              <h4 className="font-bold text-highlight mb-2">Assigned Jobs ({jobs.filter(j => j.assignedTo === selectedEmp.name).length})</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {jobs.filter(j => j.assignedTo === selectedEmp.name).map(j => (
                  <div key={j.id} className="p-2.5 rounded-lg bg-black/20 border border-glass/10 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-accent font-semibold">{j.id}</span>
                      <p className="text-glass-dim text-[11px] truncate max-w-xs">{j.description}</p>
                    </div>
                    <StatusBadge status={j.status} dot />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
