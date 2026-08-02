import { useState, useMemo } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatusBadge, PriorityBadge, ModeBadge } from '@/components/ui/StatusBadge'
import { jobs as initialJobs, Job, JobStatus, Priority, JobMode, customers, employees } from '@/lib/data'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import {
  Search,
  Plus,
  ArrowUpDown,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Download,
  LayoutGrid,
  List,
  X,
  AlertCircle,
  Filter as FilterIcon,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const kanbanStatuses: JobStatus[] = ['New', 'Quoted', 'Approved', 'Procuring', 'In Progress', 'Quality Check', 'Completed', 'Invoiced']

// ─── Job Modal ───────────────────────────────────────────────────────────────
function JobModal({
  job,
  onClose,
  onSave,
}: {
  job?: Job
  onClose: () => void
  onSave: (data: Omit<Job, 'id' | 'createdAt'>) => void
}) {
  const [customer, setCustomer] = useState(job?.customer || customers[0].company)
  const [description, setDescription] = useState(job?.description || '')
  const [priority, setPriority] = useState<Priority>(job?.priority || 'Medium')
  const [mode, setMode] = useState<JobMode>(job?.mode || 'Workshop Procures')
  const [assignedTo, setAssignedTo] = useState(job?.assignedTo || employees[0].name)
  const [deadline, setDeadline] = useState(job?.deadline || '')
  const status: JobStatus = job?.status || 'New'
  const [revenue, setRevenue] = useState(job?.revenue || 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ customer, description, priority, mode, assignedTo, deadline, status, revenue })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg mx-4 glass-card p-6 dark:bg-slate-900/90 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {job ? 'Edit Job' : 'New Job'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Customer</label>
              <select value={customer} onChange={(e) => setCustomer(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40">
                {customers.map((c) => <option key={c.id} value={c.company}>{c.company}</option>)}
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Assigned To</label>
              <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40">
                {employees.map((e) => <option key={e.id} value={e.name}>{e.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Job Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Describe the job..." className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40 resize-none" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Mode</label>
              <select value={mode} onChange={(e) => setMode(e.target.value as JobMode)} className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 font-medium focus:outline-none">
                <option value="Workshop Procures">Workshop Procures</option>
                <option value="Client Supplies">Client Supplies</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 font-medium focus:outline-none">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Deadline</label>
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Revenue (₹)</label>
              <input type="number" value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/40" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary text-xs">Cancel</button>
            <button type="submit" className="btn-primary text-xs">{job ? 'Update Job' : 'Create Job'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ─── Delete Confirmation ─────────────────────────────────────────────────────
function DeleteConfirmModal({ jobId, onClose, onConfirm }: { jobId: string; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm mx-4 glass-card p-6 dark:bg-slate-900/90"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Delete Job</h2>
            <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">
          Are you sure you want to delete <strong>{jobId}</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary text-xs">Cancel</button>
          <button onClick={onConfirm} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors text-xs">Delete</button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Main Jobs Page ──────────────────────────────────────────────────────────
export default function Jobs() {
  const { userRole } = useAuth()
  const isManager = userRole === 'manager'

  const [jobList, setJobList] = useState<Job[]>(initialJobs)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [priorityFilter, setPriorityFilter] = useState<string>('All')
  const [sortField, setSortField] = useState<keyof Job>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table')
  const [showJobModal, setShowJobModal] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | undefined>(undefined)
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null)
  const pageSize = 6

  // Filtering & Sorting
  const filteredJobs = useMemo(() => {
    return jobList
      .filter((job) => {
        const matchesSearch =
          job.id.toLowerCase().includes(search.toLowerCase()) ||
          job.customer.toLowerCase().includes(search.toLowerCase()) ||
          job.description.toLowerCase().includes(search.toLowerCase()) ||
          job.assignedTo.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter === 'All' || job.status === statusFilter
        const matchesPriority = priorityFilter === 'All' || job.priority === priorityFilter
        return matchesSearch && matchesStatus && matchesPriority
      })
      .sort((a, b) => {
        const valA = a[sortField]
        const valB = b[sortField]
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
  }, [jobList, search, statusFilter, priorityFilter, sortField, sortOrder])

  const totalPages = Math.ceil(filteredJobs.length / pageSize)
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const toggleSort = (field: keyof Job) => {
    if (sortField === field) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const handleSaveJob = (data: Omit<Job, 'id' | 'createdAt'>) => {
    if (editingJob) {
      setJobList((prev) => prev.map((j) => j.id === editingJob.id ? { ...j, ...data } : j))
    } else {
      const newId = `JOB-${String(jobList.length + 1).padStart(3, '0')}`
      setJobList((prev) => [...prev, { ...data, id: newId, createdAt: new Date().toISOString().split('T')[0] }])
    }
    setEditingJob(undefined)
  }

  const handleDeleteJob = () => {
    if (deleteJobId) {
      setJobList((prev) => prev.filter((j) => j.id !== deleteJobId))
      setDeleteJobId(null)
    }
  }

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('All')
    setPriorityFilter('All')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Job Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track, assign, and manage manufacturing jobs across stages
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 shadow-sm text-orange-600' : 'text-slate-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'kanban' ? 'bg-white dark:bg-slate-700 shadow-sm text-orange-600' : 'text-slate-400'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <button className="btn-secondary text-xs">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button onClick={() => { setEditingJob(undefined); setShowJobModal(true) }} className="btn-primary text-xs">
            <Plus className="w-4 h-4" />
            <span>New Job</span>
          </button>
        </div>
      </div>

      {/* Controls Bar */}
      <GlassCard className="p-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, customer, assigned worker..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Status:</span>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-1.5 rounded-xl text-xs bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 font-medium text-slate-700 dark:text-slate-200 focus:outline-none">
                <option value="All">All Statuses</option>
                {kanbanStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Priority:</span>
              <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-3 py-1.5 rounded-xl text-xs bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 font-medium text-slate-700 dark:text-slate-200 focus:outline-none">
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <GlassCard className="py-16 text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No jobs match your filters</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">Try adjusting your search or filter criteria</p>
          <button onClick={clearFilters} className="btn-primary text-xs">
            <FilterIcon className="w-4 h-4" />
            <span>Clear Filters</span>
          </button>
        </GlassCard>
      )}

      {/* Table View */}
      {viewMode === 'table' && filteredJobs.length > 0 && (
        <GlassCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-semibold bg-slate-50/50 dark:bg-slate-800/30">
                  <th className="py-3.5 px-4 cursor-pointer" onClick={() => toggleSort('id')}>
                    <div className="flex items-center gap-1"><span>Job ID</span><ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Mode</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Assigned To</th>
                  <th className="py-3.5 px-4 cursor-pointer" onClick={() => toggleSort('deadline')}>
                    <div className="flex items-center gap-1"><span>Deadline</span><ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="py-3.5 px-4">Status</th>
                  {!isManager && (
                    <th className="py-3.5 px-4 cursor-pointer text-right" onClick={() => toggleSort('revenue')}>
                      <div className="flex items-center justify-end gap-1"><span>Revenue</span><ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                  )}
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                <AnimatePresence>
                  {paginatedJobs.map((job) => (
                    <motion.tr
                      key={job.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-orange-600 dark:text-orange-400">{job.id}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{job.customer}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{job.description}</p>
                      </td>
                      <td className="py-3.5 px-4"><ModeBadge mode={job.mode} /></td>
                      <td className="py-3.5 px-4"><PriorityBadge priority={job.priority} /></td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">{job.assignedTo}</td>
                      <td className="py-3.5 px-4 text-slate-500 font-medium">{formatDate(job.deadline)}</td>
                      <td className="py-3.5 px-4"><StatusBadge status={job.status} /></td>
                      {!isManager && (
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white">{formatCurrency(job.revenue)}</td>
                      )}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-orange-600 transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => { setEditingJob(job); setShowJobModal(true) }} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-colors">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteJobId(job.id)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10 text-xs text-slate-500">
            <span>
              Showing {Math.min((currentPage - 1) * pageSize + 1, filteredJobs.length)} to{' '}
              {Math.min(currentPage * pageSize, filteredJobs.length)} of {filteredJobs.length} jobs
            </span>
            <div className="flex items-center gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Page {currentPage} of {totalPages || 1}</span>
              <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && filteredJobs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 overflow-x-auto">
          {kanbanStatuses.map((status) => {
            const statusJobs = filteredJobs.filter((j) => j.status === status)
            return (
              <div key={status} className="kanban-col flex flex-col min-w-[240px]">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{status}</h3>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {statusJobs.length}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-320px)]">
                  {statusJobs.map((job) => (
                    <motion.div key={job.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                      <GlassCard className="p-3.5 cursor-pointer hover:border-orange-500/40" onClick={() => { setEditingJob(job); setShowJobModal(true) }}>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400">{job.id}</span>
                          <PriorityBadge priority={job.priority} />
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-2">{job.customer}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{job.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <ModeBadge mode={job.mode} />
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                          <span>{job.assignedTo}</span>
                          <span className="font-medium">{formatDate(job.deadline)}</span>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                  {statusJobs.length === 0 && (
                    <div className="text-center py-8 text-[10px] text-slate-400">No jobs</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showJobModal && (
          <JobModal
            job={editingJob}
            onClose={() => { setShowJobModal(false); setEditingJob(undefined) }}
            onSave={handleSaveJob}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteJobId && (
          <DeleteConfirmModal
            jobId={deleteJobId}
            onClose={() => setDeleteJobId(null)}
            onConfirm={handleDeleteJob}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
