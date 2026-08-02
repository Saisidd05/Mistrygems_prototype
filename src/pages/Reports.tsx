import { GlassCard } from '@/components/ui/GlassCard'
import { RevenueLineChart, PerformanceBarChart, StatusPieChart } from '@/components/ui/Charts'
import { FileSpreadsheet, FileText, Calendar } from 'lucide-react'

export default function Reports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Analytics & Reports
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Deep dive into monthly revenue, job completion velocity, and worker efficiency
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary text-xs">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Excel</span>
          </button>
          <button className="btn-primary text-xs">
            <FileText className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <GlassCard className="p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-orange-600" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Date Range: Last 6 Months (Aug 2023 - Jan 2024)
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Filter Department:</span>
          <select className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-200">
            <option>All Departments</option>
            <option>CNC Machining</option>
            <option>Fabrication</option>
            <option>QC</option>
            <option>Lathe Turning</option>
            <option>Welding</option>
            <option>Production</option>
          </select>
        </div>
      </GlassCard>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Monthly Jobs Completed vs Target
            </h2>
            <p className="text-xs text-slate-500">Target: 30 jobs/month</p>
          </div>
          <RevenueLineChart />
        </GlassCard>

        <GlassCard>
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Employee Performance Benchmarks
            </h2>
            <p className="text-xs text-slate-500">Based on defect rates & on-time delivery</p>
          </div>
          <PerformanceBarChart />
        </GlassCard>
      </div>

      {/* Status & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-1">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            Job Pipeline Breakdown
          </h2>
          <StatusPieChart />
        </GlassCard>

        <GlassCard className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Key Performance Metrics (KPI Summary)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/30">
              <span className="text-xs text-orange-700 dark:text-orange-300 font-medium">On-Time Delivery Rate</span>
              <p className="text-2xl font-extrabold text-orange-900 dark:text-orange-200 mt-1">94.2%</p>
              <span className="text-[10px] text-emerald-600 font-bold">+2.4% vs last month</span>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/30">
              <span className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">Average Completion Time</span>
              <p className="text-2xl font-extrabold text-indigo-900 dark:text-indigo-200 mt-1">4.8 Days</p>
              <span className="text-[10px] text-emerald-600 font-bold">-0.5 days faster</span>
            </div>

            <div className="p-4 rounded-xl bg-cyan-50/60 dark:bg-cyan-950/20 border border-cyan-200/50 dark:border-cyan-900/30">
              <span className="text-xs text-cyan-700 dark:text-cyan-300 font-medium">Quality Inspection Pass Rate</span>
              <p className="text-2xl font-extrabold text-cyan-900 dark:text-cyan-200 mt-1">98.1%</p>
              <span className="text-[10px] text-emerald-600 font-bold">Top tier standard</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
