import React, { useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatusBadge, PriorityBadge } from '@/components/ui/StatusBadge'
import { RevenueLineChart, PerformanceBarChart, StatusPieChart } from '@/components/ui/Charts'
import { jobs, activityData, jobStatusData } from '@/lib/data'
import { formatCurrency, formatDate } from '@/lib/utils'
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
  Filter,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState('2024-02-15')

  const totalJobs = jobs.length
  const pendingJobs = jobs.filter((j) => j.status === 'Pending' || j.status === 'Assigned').length
  const completedJobs = jobs.filter((j) => j.status === 'Completed' || j.status === 'Delivered').length
  const totalRevenue = jobs.reduce((sum, j) => sum + j.revenue, 0)
  const activeEmployees = 5
  const todayTasks = 8

  const kpis = [
    { title: 'Total Jobs', value: totalJobs, change: '+12% from last mo', icon: Briefcase, color: 'blue', bg: 'kpi-blue' },
    { title: 'Pending Jobs', value: pendingJobs, change: '3 urgent priority', icon: Clock, color: 'amber', bg: 'kpi-amber' },
    { title: 'Completed Jobs', value: completedJobs, change: '+8% efficiency', icon: CheckCircle2, color: 'emerald', bg: 'kpi-emerald' },
    { title: 'Total Revenue', value: formatCurrency(totalRevenue), change: '+18.4% growth', icon: TrendingUp, color: 'indigo', bg: 'kpi-indigo' },
    { title: 'Active Employees', value: activeEmployees, change: '100% attendance', icon: Users, color: 'cyan', bg: 'kpi-cyan' },
    { title: "Today's Tasks", value: todayTasks, change: '4 completed', icon: Activity, color: 'rose', bg: 'kpi-rose' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, Sai Mistry! Here is what's happening at your factory today.
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <GlassCard className="p-4 relative overflow-hidden" glow={kpi.color as any}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {kpi.title}
                </span>
                <div className={`p-2 rounded-xl ${kpi.bg}`}>
                  <kpi.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
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
            <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
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
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              Live Updates
            </span>
          </div>
          <div className="space-y-4">
            {activityData.slice(0, 5).map((act, index) => (
              <div key={index} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
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

        {/* Calendar Widget */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Schedule & Deadlines
            </h2>
            <CalendarIcon className="w-4 h-4 text-slate-400" />
          </div>
          <div className="bg-slate-50/80 dark:bg-slate-800/40 p-4 rounded-xl text-center mb-4 border border-slate-200/50 dark:border-slate-700/30">
            <p className="text-xs text-slate-400">Selected Date</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              Thursday, 15 Feb 2024
            </p>
          </div>
          <div className="space-y-2.5">
            <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 text-xs flex justify-between items-center">
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-300">
                  JOB-001 Polishing
                </p>
                <p className="text-[10px] text-amber-700 dark:text-amber-400">
                  Ramesh Kumar
                </p>
              </div>
              <span className="text-[10px] font-bold text-amber-600">DUE TODAY</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/30 text-xs flex justify-between items-center">
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-300">
                  JOB-012 Setting
                </p>
                <p className="text-[10px] text-blue-700 dark:text-blue-400">
                  Sunita Mehta
                </p>
              </div>
              <span className="text-[10px] font-bold text-blue-600">IN 1 DAY</span>
            </div>
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
              Latest manufacturing and repair jobs in progress
            </p>
          </div>
          <Link to="/jobs">
            <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
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
                <th className="pb-3 px-3">Priority</th>
                <th className="pb-3 px-3">Assigned To</th>
                <th className="pb-3 px-3">Deadline</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {jobs.slice(0, 5).map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-semibold text-blue-600 dark:text-blue-400">
                    {job.id}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                    {job.customer}
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
                  <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                    {formatCurrency(job.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
