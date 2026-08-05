import React, { useState } from 'react'
import { Package, Layers, AlertTriangle, Plus, Search } from 'lucide-react'
import { rawMaterials, finishedGoods } from '../lib/data'
import { GlassCard } from '../components/ui/GlassCard'
import { GlowButton } from '../components/ui/GlowButton'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useToast } from '../components/ui/Toast'
import { formatCurrency } from '../lib/utils'

export function Inventory() {
  const { showToast } = useToast()
  const [tab, setTab] = useState<'raw' | 'finished'>('raw')
  const [search, setSearch] = useState('')

  const filteredRaw = rawMaterials.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.sku.toLowerCase().includes(search.toLowerCase()))
  const filteredFinished = finishedGoods.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.sku.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory Tracking</h1>
          <p className="page-subtitle">Real-time stock management for raw stock materials and finished component goods.</p>
        </div>
        <GlowButton size="sm" icon={<Plus size={16} />} onClick={() => showToast('Stock adjustment form opened', 'info')}>
          Stock In / Out
        </GlowButton>
      </div>

      <div className="flex gap-3 border-b border-glass/10 pb-2">
        <button
          onClick={() => setTab('raw')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${tab === 'raw' ? 'bg-[#00B4D8]/20 text-highlight border border-[#00B4D8]/30' : 'text-glass-dim'}`}
        >
          Raw Materials ({rawMaterials.length})
        </button>
        <button
          onClick={() => setTab('finished')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${tab === 'finished' ? 'bg-[#00B4D8]/20 text-highlight border border-[#00B4D8]/30' : 'text-glass-dim'}`}
        >
          Finished Goods ({finishedGoods.length})
        </button>
      </div>

      <GlassCard className="p-4">
        <div className="relative max-w-md">
          <input
            className="glass-input pl-10"
            placeholder="Search material or product SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-glass-dim" />
        </div>
      </GlassCard>

      <GlassCard className="p-4 overflow-x-auto">
        {tab === 'raw' ? (
          <table className="glass-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Material Name</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
                <th>Unit Cost</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRaw.map(rm => (
                <tr key={rm.id}>
                  <td className="font-mono text-xs text-accent font-semibold">{rm.sku}</td>
                  <td className="text-highlight font-medium">{rm.name}</td>
                  <td className="font-bold text-highlight">{rm.currentStock} {rm.unit}</td>
                  <td className="text-xs">{rm.reorderLevel} {rm.unit}</td>
                  <td className="text-xs">{formatCurrency(rm.unitCost)}</td>
                  <td><StatusBadge status={rm.status} dot /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="glass-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Current Stock</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {filteredFinished.map(fg => (
                <tr key={fg.id}>
                  <td className="font-mono text-xs text-accent font-semibold">{fg.sku}</td>
                  <td className="text-highlight font-medium">{fg.name}</td>
                  <td className="font-bold text-emerald-400">{fg.currentStock} {fg.unit}</td>
                  <td className="text-xs">{fg.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>
    </div>
  )
}
