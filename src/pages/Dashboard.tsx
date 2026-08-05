import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Briefcase, IndianRupee, Clock, CheckCircle2, Plus, ArrowRight,
  TrendingUp, Activity, AlertCircle, FileText, ChevronRight
} from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { useAuth } from '../context/AuthContext'
import { StatCard, GlassCard } from '../components/ui/GlassCard'
import { GlowButton } from '../components/ui/GlowButton'
import { StatusBadge } from '../components/ui/StatusBadge'
import { RevenueChart, JobsBarChart, StatusPieChart, PerformanceChart } from '../components/ui/Charts'
import { Modal } from '../components/ui/Modal'
import { JobForm } from '../components/forms/JobForm'
import { useToast } from '../components/ui/Toast'
import { formatCurrency, formatDate } from '../lib/utils'
import type { Job } from '../lib/data'

export function Dashboard() {
  const { jobs, customers, employees, addJob } = useAppData()
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [openNewJobModal, setOpenNewJobModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  const activeJobs = jobs.filter(j => j.status !== 'Completed' && j.status !== 'Invoiced')
  const completedJobs = jobs.filter(j => j.status === 'Completed' || j.status === 'Invoiced')
  const totalRevenue = jobs.reduce((acc, j) => acc + (j.revenue || 0), 0)

  const customerNames = customers.map(c => c.name)
  const employeeNames = employees.map(e => e.name)

  const handleCreateJob = (data: Omit<Job, 'id' | 'createdAt'>) => {
    addJob(data)
    setOpenNewJobModal(false)
    showToast('New manufacturing job created successfully!', 'success')
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 border-glass-bright">
        <div>
          <span className="glass-badge mb-2">Welcome Back, {user?.name}</span>
          <h1 className="text-2xl font-bold font-sora gradient-text-bright">Workshop Command Center</h1>
          <p className="text-xs text-glass-dim mt-1">Real-time production pipeline and key business operational metrics.</p>
        </div>
        <div className="flex gap-3">
          <GlowButton variant="outline" size="sm" onClick={() => navigate('/reports')}>
            View Reports
          </GlowButton>
          <GlowButton size="sm" icon={<Plus size={16} />} onClick={() => setOpenNewJobModal(true)}>
            Create New Job
          </GlowButton>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Active Jobs"
          value={activeJobs.length}
          icon={<Briefcase size={20} className="text-accent" />}
          trend="up"
          sub={`${jobs.length} total recorded`}
          color="blue"
        />
        <StatCard
          label="Total Revenue Generated"
          value={formatCurrency(totalRevenue)}
          icon={<IndianRupee size={20} className="text-emerald-400" />}
          trend="up"
          sub="Across all orders"
          color="cyan"
        />
        <StatCard
          label="Completed Orders"
          value={completedJobs.length}
          icon={<CheckCircle2 size={20} className="text-emerald-400" />}
          trend="neutral"
          sub="Delivery success"
          color="green"
        />
        <StatCard
          label="Team Capacity"
          value={`${employees.filter(e => e.status === 'Active').length} Active`}
          icon={<Activity size={20} className="text-amber-400" />}
          sub={`${employees.length} Total Workforce`}
          color="amber"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold font-sora text-highlight flex items-center gap-2">
              <TrendingUp size={16} className="text-accent" /> Revenue & Performance Analytics
            </h3>
          </div>
          <RevenueChart />
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold font-sora text-highlight">Job Status Pipeline</h3>
          </div>
          <StatusPieChart />
        </GlassCard>
      </div>

      {/* Recent Active Jobs & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold font-sora text-highlight flex items-center gap-2">
              <Briefcase size={16} className="text-accent" /> Active Jobs Overview
            </h3>
            <Link to="/jobs" className="text-xs text-accent hover:underline flex items-center gap-1">
              View All <ChevronRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Job ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Deadline</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {jobs.slice(0, 5).map(job => (
                  <tr key={job.id} onClick={() => setSelectedJob(job)} className="cursor-pointer">
                    <td className="font-mono text-xs text-accent font-semibold">{job.id}</td>
                    <td className="text-highlight font-medium">{job.customer}</td>
                    <td><StatusBadge status={job.status} dot /></td>
                    <td><StatusBadge status={job.priority} /></td>
                    <td className="text-xs">{formatDate(job.deadline)}</td>
                    <td className="font-semibold text-highlight">{formatCurrency(job.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold font-sora text-highlight">Top Performers</h3>
          </div>
          <PerformanceChart />
        </GlassCard>
      </div>

      {/* New Job Modal */}
      <Modal open={openNewJobModal} onClose={() => setOpenNewJobModal(false)} title="Create New Job">
        <JobForm
          onSubmit={handleCreateJob}
          onCancel={() => setOpenNewJobModal(false)}
          customers={customerNames}
          employees={employeeNames}
        />
      </Modal>

      {/* Job Details Modal */}
      <Modal open={!!selectedJob} onClose={() => setSelectedJob(null)} title={`Job Details: ${selectedJob?.id}`}>
        {selectedJob && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-white/5 border border-glass/10">
              <div>
                <span className="text-glass-dim block">Customer</span>
                <span className="text-highlight font-semibold text-sm">{selectedJob.customer}</span>
              </div>
              <div>
                <span className="text-glass-dim block">Revenue</span>
                <span className="text-emerald-400 font-semibold text-sm">{formatCurrency(selectedJob.revenue)}</span>
              </div>
              <div>
                <span className="text-glass-dim block">Status</span>
                <StatusBadge status={selectedJob.status} dot />
              </div>
              <div>
                <span className="text-glass-dim block">Priority</span>
                <StatusBadge status={selectedJob.priority} />
              </div>
              <div>
                <span className="text-glass-dim block">Assigned Operator</span>
                <span className="text-glass font-medium">{selectedJob.assignedTo || 'Unassigned'}</span>
              </div>
              <div>
                <span className="text-glass-dim block">Deadline</span>
                <span className="text-glass font-medium">{formatDate(selectedJob.deadline)}</span>
              </div>
            </div>
            <div>
              <span className="text-glass-dim block mb-1">Description</span>
              <p className="text-glass bg-black/20 p-3 rounded-xl border border-glass/10">{selectedJob.description}</p>
            </div>
            <div className="flex justify-end pt-2">
              <GlowButton variant="outline" size="sm" onClick={() => setSelectedJob(null)}>Close</GlowButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
