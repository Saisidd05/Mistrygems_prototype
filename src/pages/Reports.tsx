import React from 'react'
import { BarChart2, TrendingUp, Users, Award, Download } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { GlowButton } from '../components/ui/GlowButton'
import { RevenueChart, JobsBarChart, StatusPieChart, PerformanceChart } from '../components/ui/Charts'
import { useToast } from '../components/ui/Toast'

export function Reports() {
  const { showToast } = useToast()

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
          <RevenueChart />
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="text-sm font-bold font-sora text-highlight mb-4 flex items-center gap-2">
            <BarChart2 size={16} className="text-accent" /> Monthly Completed Jobs
          </h3>
          <JobsBarChart />
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="text-sm font-bold font-sora text-highlight mb-4">Pipeline Distribution</h3>
          <StatusPieChart />
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="text-sm font-bold font-sora text-highlight mb-4 flex items-center gap-2">
            <Award size={16} className="text-accent" /> Workforce Efficiency Index
          </h3>
          <PerformanceChart />
        </GlassCard>
      </div>
    </div>
  )
}
