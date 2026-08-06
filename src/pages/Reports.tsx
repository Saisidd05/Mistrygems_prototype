import React from 'react'
import { BarChart2, TrendingUp, Award, Download } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { GlowButton } from '../components/ui/GlowButton'
import { RevenueChart, JobsBarChart, StatusPieChart, PerformanceChart } from '../components/ui/Charts'
import { useToast } from '../components/ui/Toast'
import { useAppData } from '../context/AppDataContext'

export function Reports() {
  const { showToast } = useToast()
  const { jobs, employees } = useAppData()
  const monthlyData = jobs.reduce<{ month: string; revenue: number; jobs: number }[]>((result, job) => {
    const month = new Date(job.createdAt).toLocaleString('en', { month: 'short' }); const entry = result.find(item => item.month === month)
    if (entry) { entry.revenue += job.revenue || 0; entry.jobs += 1 } else result.push({ month, revenue: job.revenue || 0, jobs: 1 }); return result
  }, [])
  const statusData = Object.entries(jobs.reduce<Record<string, number>>((counts, job) => ({ ...counts, [job.status]: (counts[job.status] || 0) + 1 }), {})).map(([name, value]) => ({ name, value, color: '#00B4D8' }))
  const performanceData = employees.map(employee => ({ name: employee.name.split(' ')[0], performance: employee.performance }))

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics & Reports</h1>
          <p className="page-subtitle">Departmental performance metrics, job velocity charts, and operational revenue.</p>
        </div>
        <GlowButton size="sm" icon={<Download size={14} />} onClick={() => showToast('Full summary PDF report generated!', 'success')}>
          Download Report PDF
        </GlowButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-5">
          <h3 className="text-sm font-bold font-sora text-highlight mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-accent" /> Monthly Revenue Trend
          </h3>
          {monthlyData.length ? <RevenueChart data={monthlyData} /> : <p className="py-20 text-center text-sm text-glass-dim">No revenue data yet.</p>}
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="text-sm font-bold font-sora text-highlight mb-4 flex items-center gap-2">
            <BarChart2 size={16} className="text-accent" /> Monthly Completed Jobs
          </h3>
          {monthlyData.length ? <JobsBarChart data={monthlyData} /> : <p className="py-20 text-center text-sm text-glass-dim">No orders available.</p>}
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="text-sm font-bold font-sora text-highlight mb-4">Pipeline Distribution</h3>
          {statusData.length ? <StatusPieChart data={statusData} /> : <p className="py-20 text-center text-sm text-glass-dim">No pipeline data yet.</p>}
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="text-sm font-bold font-sora text-highlight mb-4 flex items-center gap-2">
            <Award size={16} className="text-accent" /> Workforce Efficiency Index
          </h3>
          {performanceData.length ? <PerformanceChart data={performanceData} /> : <p className="py-20 text-center text-sm text-glass-dim">No team members yet.</p>}
        </GlassCard>
      </div>
    </div>
  )
}
