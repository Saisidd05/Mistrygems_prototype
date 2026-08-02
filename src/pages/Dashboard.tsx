import React from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatusBadge, PriorityBadge, ModeBadge } from '@/components/ui/StatusBadge'
import { RevenueLineChart, PerformanceBarChart, StatusPieChart } from '@/components/ui/Charts'
import { jobs, activityData, jobStatusData } from '@/lib/data'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import {
  Briefcase,
  Clock,
  CheckCircle2,
  TrendingUp,
  Users,
  Calendar as CalendarIcon,
  Activity,
  ArrowRight,
  Plus,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

// ─── Client Portal View ──────────────────────────────────────────────────────
function ClientPortal() {
  const clientJobs = jobs // In a real app, filter by logged-in client

  const statusSteps = ['New', 'Quoted', 'Approved', 'Procuring', 'In Progress', 'Quality Check', 'Completed', 'Invoiced']

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Jobs
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your manufacturing orders at Mistry Gems
          </p>
        </div>
        <button className="btn-primary text-sm px-6 py-3">
          <Plus className="w-5 h-5" />
          <span>Request New Job</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {clientJobs.map((job, index) => {
          const currentStepIndex = statusSteps.indexOf(job.status)

          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <GlassCard className="p-5" glow="amber">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono text-slate-400">{job.id}</span>
                      <ModeBadge mode={job.mode} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 line-clamp-2">
                      {job.description}
                    </h3>
                  </div>
                  <StatusBadge status={job.status} />
                </div>

                {/* Progress Stepper */}
                <div className="mt-4">
                  <div className="flex items-center gap-0.5">
                    {statusSteps.map((step, i) => (
                      <div key={step} className="flex-1 flex items-center">
                        <div
                          className={`h-1.5 rounded-full w-full transition-colors ${
                            i <= currentStepIndex
                              ? 'bg-orange-500'
                              : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[9px] text-slate-400">New</span>
                    <span className="text-[9px] text-slate-400">Invoiced</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Expected: {formatDate(job.deadline)}</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {job.assignedTo}
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ─── KPI icon color mapping ──────────────────────────────────────────────────
type CardGlow = NonNullable<React.ComponentProps<typeof GlassCard>['glow']>
type Kpi = {
  title: string
  value: string | number
  change: string
  icon: React.ComponentType<{ className?: string }>
  color: CardGlow
  bg: string
}

const iconColorMap: Record<CardGlow, string> = {
  none: 'text-slate-600 dark:text-slate-400',
  blue: 'text-blue-600 dark:text-blue-400',
  amber: 'text-amber-600 dark:text-amber-400',
  emerald: 'text-emerald-600 dark:text-emerald-400',
  indigo: 'text-indigo-600 dark:text-indigo-400',
  cyan: 'text-cyan-600 dark:text-cyan-400',
  rose: 'text-rose-600 dark:text-rose-400',
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const { userRole } = useAuth()

  // Client portal
  if (userRole === 'client') {
    return <ClientPortal />
  }

  const isManager = userRole === 'manager'

  const totalJobs = jobs.length
  const pendingJobs = jobs.filter((j) => j.status === 'New' || j.status === 'Quoted').length
  const completedJobs = jobs.filter((j) => j.status === 'Completed' || j.status === 'Invoiced').length
  const totalRevenue = jobs.reduce((sum, j) => sum + j.revenue, 0)
  const activeEmployees = 5
  const todayTasks = 8

  const revenueKpis: Kpi[] = !isManager
    ? [{ title: 'Total Revenue', value: formatCurrency(totalRevenue), change: '+18.4% growth', icon: TrendingUp, color: 'indigo', bg: 'kpi-indigo' }]
    : []
  const kpis: Kpi[] = [
    { title: 'Total Jobs', value: totalJobs, change: '+12% from last mo', icon: Briefcase, color: 'blue', bg: 'kpi-blue' },
    { title: 'Pending Jobs', value: pendingJobs, change: '3 urgent priority', icon: Clock, color: 'amber', bg: 'kpi-amber' },
    { title: 'Completed Jobs', value: completedJobs, change: '+8% efficiency', icon: CheckCircle2, color: 'emerald', bg: 'kpi-emerald' },
    ...revenueKpis,
    { title: 'Active Employees', value: activeEmployees, change: '100% attendance', icon: Users, color: 'cyan', bg: 'kpi-cyan' },
    { title: "Today's Tasks", value: todayTasks, change: '4 completed', icon: Activity, color: 'rose', bg: 'kpi-rose' },
  ]

  // Upcoming deadlines — jobs due in the next 7 days
  const now = new Date()
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const upcomingDeadlines = jobs
    .filter((j) => {
      const d = new Date(j.deadline)
      return d >= now && d <= sevenDaysFromNow && j.status !== 'Completed' && j.status !== 'Invoiced'
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 4)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, Workshop Owner! Here is what's happening at Mistry Gems today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/jobs">
            <button className="btn-primary">
              <Plus className="w-4 h-4" />
              <span>Create New Job</span>
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${isManager ? 'xl:grid-cols-5' : 'xl:grid-cols-6'} gap-4`}>
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <GlassCard className="p-4 relative overflow-hidden" glow={kpi.color}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {kpi.title}
                </span>
                <div className={`p-2 rounded-xl ${kpi.bg}`}>
                  <kpi.icon className={`w-4 h-4 ${iconColorMap[kpi.color] || 'text-blue-600 dark:text-blue-400'}`} />
                </div>
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                {kpi.value}
              </p>
              <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                {kpi.change}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Revenue & Job Growth
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monthly revenue performance in INR
              </p>
            </div>
            <button className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
              <span>View Report</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <RevenueLineChart />
        </GlassCard>

        {/* Pie Chart / Job Status */}
        <GlassCard>
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Job Status Breakdown
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Distribution across pipeline stages
            </p>
          </div>
          <StatusPieChart />
          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {jobStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Middle Row: Bar Chart + Activity Timeline + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <GlassCard>
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Employee Performance
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Efficiency score by employee (%)
            </p>
          </div>
          <PerformanceBarChart />
        </GlassCard>

        {/* Activity Timeline */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Activity Timeline
            </h2>
            <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
              Live Updates
            </span>
          </div>
          <div className="space-y-4">
            {activityData.slice(0, 5).map((act, index) => (
              <div key={index} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {act.event}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    by {act.user} • {act.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Upcoming Deadlines Widget */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Upcoming Deadlines
            </h2>
            <CalendarIcon className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-2.5">
            {upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.map((job) => {
                const daysUntil = Math.ceil((new Date(job.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                const isUrgent = daysUntil <= 2
                return (
                  <div
                    key={job.id}
                    className={`p-2.5 rounded-xl text-xs flex justify-between items-center ${
                      isUrgent
                        ? 'bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30'
                        : 'bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/30'
                    }`}
                  >
                    <div>
                      <p className={`font-semibold ${isUrgent ? 'text-amber-900 dark:text-amber-300' : 'text-blue-900 dark:text-blue-300'}`}>
                        {job.id} — {job.description.split('—')[0].trim().slice(0, 30)}
                      </p>
                      <p className={`text-[10px] ${isUrgent ? 'text-amber-700 dark:text-amber-400' : 'text-blue-700 dark:text-blue-400'}`}>
                        {job.assignedTo}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold ${isUrgent ? 'text-amber-600' : 'text-blue-600'}`}>
                      {daysUntil === 0 ? 'DUE TODAY' : daysUntil === 1 ? 'IN 1 DAY' : `IN ${daysUntil} DAYS`}
                    </span>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No upcoming deadlines this week</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Recent Jobs Table */}
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Jobs
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest manufacturing jobs in progress
            </p>
          </div>
          <Link to="/jobs">
            <button className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
              <span>View All Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="pb-3 px-3">Job ID</th>
                <th className="pb-3 px-3">Customer</th>
                <th className="pb-3 px-3">Mode</th>
                <th className="pb-3 px-3">Priority</th>
                <th className="pb-3 px-3">Assigned To</th>
                <th className="pb-3 px-3">Deadline</th>
                <th className="pb-3 px-3">Status</th>
                {!isManager && <th className="pb-3 px-3 text-right">Revenue</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {jobs.slice(0, 5).map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-semibold text-orange-600 dark:text-orange-400">
                    {job.id}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                    {job.customer}
                  </td>
                  <td className="py-3 px-3">
                    <ModeBadge mode={job.mode} />
                  </td>
                  <td className="py-3 px-3">
                    <PriorityBadge priority={job.priority} />
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {job.assignedTo}
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {formatDate(job.deadline)}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={job.status} />
                  </td>
                  {!isManager && (
                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                      {formatCurrency(job.revenue)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
