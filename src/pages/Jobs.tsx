import React, { useState } from 'react'
import {
  Briefcase, Plus, Search, Filter, Download, Edit2, Trash2, Eye,
  Kanban, Table, CheckCircle
} from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { GlassCard } from '../components/ui/GlassCard'
import { GlowButton } from '../components/ui/GlowButton'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { JobForm } from '../components/forms/JobForm'
import { useToast } from '../components/ui/Toast'
import { formatCurrency, formatDate, downloadCSV } from '../lib/utils'
import type { Job, JobStatus, Priority } from '../lib/data'

const statuses: JobStatus[] = ['New', 'Quoted', 'Approved', 'Procuring', 'In Progress', 'Quality Check', 'Completed', 'Invoiced']

export function Jobs() {
  const { jobs, customers, employees, addJob, updateJob, deleteJob } = useAppData()
  const { showToast } = useToast()

  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [priorityFilter, setPriorityFilter] = useState<string>('All')

  const [openModal, setOpenModal] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [viewingJob, setViewingJob] = useState<Job | null>(null)

  const customerNames = customers.map(c => c.name)
  const employeeNames = employees.map(e => e.name)

  const filteredJobs = jobs.filter(j => {
    const matchSearch = j.id.toLowerCase().includes(search.toLowerCase()) ||
      j.customer.toLowerCase().includes(search.toLowerCase()) ||
      j.description.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || j.status === statusFilter
    const matchPriority = priorityFilter === 'All' || j.priority === priorityFilter
    return matchSearch && matchStatus && matchPriority
  })

  const handleFormSubmit = (data: Omit<Job, 'id' | 'createdAt'>) => {
    if (editingJob) {
      updateJob(editingJob.id, data)
      showToast(`Job ${editingJob.id} updated successfully!`, 'success')
    } else {
      addJob(data)
      showToast('New job created successfully!', 'success')
    }
    setOpenModal(false)
    setEditingJob(null)
  }

  const handleDelete = () => {
    if (deletingId) {
      deleteJob(deletingId)
      showToast(`Job ${deletingId} deleted.`, 'warning')
      setDeletingId(null)
    }
  }

  const handleExport = () => {
    downloadCSV(filteredJobs as unknown as Record<string, unknown>[], 'mistry_gems_jobs')
    showToast('Exported jobs to CSV!', 'info')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Manufacturing Jobs</h1>
          <p className="page-subtitle">Track, manage and assign production jobs across your workshop.</p>
        </div>
        <div className="flex gap-2">
          <GlowButton variant="outline" size="sm" icon={<Download size={14} />} onClick={handleExport}>
            Export CSV
          </GlowButton>
          <GlowButton size="sm" icon={<Plus size={16} />} onClick={() => { setEditingJob(null); setOpenModal(true); }}>
            New Job
          </GlowButton>
        </div>
      </div>

      {/* Controls Bar */}
      <GlassCard className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            className="glass-input pl-10"
            placeholder="Search job ID, customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-glass-dim" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select className="glass-select w-auto text-xs" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select className="glass-select w-auto text-xs" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Toggle View */}
          <div className="flex p-1 rounded-xl bg-black/20 border border-glass/10 ml-auto">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'table' ? 'bg-[#00B4D8]/20 text-highlight' : 'text-glass-dim'}`}
            >
              <Table size={16} />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'kanban' ? 'bg-[#00B4D8]/20 text-highlight' : 'text-glass-dim'}`}
            >
              <Kanban size={16} />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Content View */}
      {viewMode === 'table' ? (
        <GlassCard className="p-4 overflow-x-auto">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Customer</th>
                <th>Description</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Deadline</th>
                <th>Revenue</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-glass-dim">No jobs match your filter.</td>
                </tr>
              ) : (
                filteredJobs.map(job => (
                  <tr key={job.id}>
                    <td className="font-mono text-xs text-accent font-semibold">{job.id}</td>
                    <td className="text-highlight font-medium">{job.customer}</td>
                    <td className="max-w-xs truncate text-xs">{job.description}</td>
                    <td><StatusBadge status={job.status} dot /></td>
                    <td><StatusBadge status={job.priority} /></td>
                    <td className="text-xs">{job.assignedTo || 'Unassigned'}</td>
                    <td className="text-xs">{formatDate(job.deadline)}</td>
                    <td className="font-semibold text-highlight">{formatCurrency(job.revenue)}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewingJob(job)} className="p-1.5 hover:bg-white/10 rounded-lg text-glass-dim hover:text-highlight">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => { setEditingJob(job); setOpenModal(true); }} className="p-1.5 hover:bg-white/10 rounded-lg text-glass-dim hover:text-accent">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => setDeletingId(job.id)} className="p-1.5 hover:bg-white/10 rounded-lg text-glass-dim hover:text-red-400">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </GlassCard>
      ) : (
        /* Kanban View */
        <div className="kanban-board">
          {statuses.map(st => {
            const colJobs = filteredJobs.filter(j => j.status === st)
            return (
              <div key={st} className="kanban-column flex flex-col gap-3">
                <div className="flex items-center justify-between p-3 rounded-xl glass-card bg-white/5">
                  <span className="text-xs font-bold text-highlight">{st}</span>
                  <span className="text-xs font-mono text-accent bg-[#00B4D8]/10 px-2 py-0.5 rounded-full">{colJobs.length}</span>
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  {colJobs.map(job => (
                    <GlassCard key={job.id} className="p-4 hover:border-accent/40 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-accent font-semibold">{job.id}</span>
                        <StatusBadge status={job.priority} />
                      </div>
                      <h4 className="text-xs font-bold text-highlight">{job.customer}</h4>
                      <p className="text-[11px] text-glass-dim line-clamp-2">{job.description}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-glass/10 text-[11px]">
                        <span className="text-emerald-400 font-semibold">{formatCurrency(job.revenue)}</span>
                        <span className="text-glass-dim">{formatDate(job.deadline)}</span>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Job Create/Edit Modal */}
      <Modal open={openModal} onClose={() => { setOpenModal(false); setEditingJob(null); }} title={editingJob ? `Edit Job ${editingJob.id}` : 'Create New Job'}>
        <JobForm
          initial={editingJob || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => { setOpenModal(false); setEditingJob(null); }}
          customers={customerNames}
          employees={employeeNames}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Job"
        message={`Are you sure you want to delete ${deletingId}? This action cannot be undone.`}
      />

      {/* View Drawer */}
      <Modal open={!!viewingJob} onClose={() => setViewingJob(null)} title={`Job Details: ${viewingJob?.id}`}>
        {viewingJob && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-white/5 border border-glass/10">
              <div>
                <span className="text-glass-dim block">Customer</span>
                <span className="text-highlight font-semibold text-sm">{viewingJob.customer}</span>
              </div>
              <div>
                <span className="text-glass-dim block">Revenue</span>
                <span className="text-emerald-400 font-semibold text-sm">{formatCurrency(viewingJob.revenue)}</span>
              </div>
              <div>
                <span className="text-glass-dim block">Status</span>
                <StatusBadge status={viewingJob.status} dot />
              </div>
              <div>
                <span className="text-glass-dim block">Priority</span>
                <StatusBadge status={viewingJob.priority} />
              </div>
              <div>
                <span className="text-glass-dim block">Assigned Operator</span>
                <span className="text-glass font-medium">{viewingJob.assignedTo || 'Unassigned'}</span>
              </div>
              <div>
                <span className="text-glass-dim block">Deadline</span>
                <span className="text-glass font-medium">{formatDate(viewingJob.deadline)}</span>
              </div>
            </div>
            <div>
              <span className="text-glass-dim block mb-1">Description</span>
              <p className="text-glass bg-black/20 p-3 rounded-xl border border-glass/10">{viewingJob.description}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
