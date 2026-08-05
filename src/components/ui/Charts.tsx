import React from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { monthlyRevenueData, jobStatusData, employeePerformanceData } from '../../lib/data'
import { formatCurrency } from '../../lib/utils'

const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(3,4,94,0.9)',
  border: '1px solid rgba(0,180,216,0.25)',
  borderRadius: '12px',
  color: '#CAF0F8',
  fontSize: '12px',
  backdropFilter: 'blur(20px)',
}

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={monthlyRevenueData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00B4D8" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00B4D8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(144,224,239,0.05)" />
        <XAxis dataKey="month" stroke="rgba(144,224,239,0.3)" tick={{ fontSize: 11, fill: 'rgba(144,224,239,0.5)' }} />
        <YAxis stroke="rgba(144,224,239,0.3)" tick={{ fontSize: 11, fill: 'rgba(144,224,239,0.5)' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={(v: number) => [formatCurrency(v), 'Revenue']}
        />
        <Area type="monotone" dataKey="revenue" stroke="#00B4D8" strokeWidth={2} fill="url(#revenueGrad)" dot={{ fill: '#00B4D8', r: 3 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function JobsBarChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={monthlyRevenueData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0077B6" />
            <stop offset="95%" stopColor="#00B4D8" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(144,224,239,0.05)" />
        <XAxis dataKey="month" stroke="rgba(144,224,239,0.3)" tick={{ fontSize: 11, fill: 'rgba(144,224,239,0.5)' }} />
        <YAxis stroke="rgba(144,224,239,0.3)" tick={{ fontSize: 11, fill: 'rgba(144,224,239,0.5)' }} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Bar dataKey="jobs" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function StatusPieChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={jobStatusData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {jobStatusData.map((entry, i) => (
            <Cell key={i} fill={entry.color} opacity={0.85} />
          ))}
        </Pie>
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend
          formatter={(v) => <span style={{ color: 'rgba(144,224,239,0.7)', fontSize: 11 }}>{v}</span>}
          iconSize={8}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function PerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={employeePerformanceData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="perfGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="5%" stopColor="#03045E" />
            <stop offset="95%" stopColor="#00B4D8" />
          </linearGradient>
        </defs>
        <XAxis type="number" domain={[0, 100]} stroke="rgba(144,224,239,0.3)" tick={{ fontSize: 10, fill: 'rgba(144,224,239,0.5)' }} />
        <YAxis type="category" dataKey="name" stroke="rgba(144,224,239,0.3)" tick={{ fontSize: 11, fill: 'rgba(144,224,239,0.5)' }} width={45} />
        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}%`, 'Performance']} />
        <Bar dataKey="performance" fill="url(#perfGrad)" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function MiniLineChart({ data, color = '#00B4D8' }: { data: number[]; color?: string }) {
  const chartData = data.map((v, i) => ({ v, i }))
  return (
    <ResponsiveContainer width="100%" height={50}>
      <LineChart data={chartData}>
        <defs>
          <linearGradient id="miniGrad" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor={color} stopOpacity={0.5} />
            <stop offset="100%" stopColor={color} stopOpacity={1} />
          </linearGradient>
        </defs>
        <Line type="monotone" dataKey="v" stroke={`url(#miniGrad)`} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
