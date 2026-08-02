import { GlassCard } from '@/components/ui/GlassCard'
import { customers } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'
import { Plus, Mail, Phone, MapPin } from 'lucide-react'

export default function Customers() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Customer Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage client profiles, transaction history, and active manufacturing orders
          </p>
        </div>
        <button className="btn-primary text-xs">
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((c) => (
          <GlassCard key={c.id} className="p-6 relative group" glow="cyan">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-cyan-500/20 flex-shrink-0">
                {c.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {c.company}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{c.name}</p>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 mt-1">
                  <MapPin className="w-3 h-3 text-cyan-500" />
                  {c.city}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/30">
                <span className="text-[10px] text-slate-400 block">Total Jobs</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {c.totalJobs} Orders
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/30">
                <span className="text-[10px] text-slate-400 block">Total Revenue</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(c.totalRevenue)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 truncate max-w-[160px]">
                <Mail className="w-3.5 h-3.5" />
                {c.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                {c.phone}
              </span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
