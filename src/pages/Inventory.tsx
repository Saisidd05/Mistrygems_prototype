import { useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { rawMaterials, finishedGoods, RawMaterial, FinishedGood, jobs } from '@/lib/data'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { Package, Boxes, Plus, Minus, X, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const stockStatusConfig = {
  'OK': { color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800', icon: CheckCircle2 },
  'Low Stock': { color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800', icon: AlertTriangle },
  'Out of Stock': { color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800', icon: AlertCircle },
}

// ─── Stock Modal ─────────────────────────────────────────────────────────────
function StockModal({
  type,
  items,
  onClose,
  onSave,
}: {
  type: 'in' | 'out'
  items: RawMaterial[]
  onClose: () => void
  onSave: (itemId: string, quantity: number, jobRef: string) => void
}) {
  const [selectedItem, setSelectedItem] = useState(items[0]?.id || '')
  const [quantity, setQuantity] = useState(1)
  const [jobRef, setJobRef] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(selectedItem, quantity, jobRef)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md mx-4 glass-card p-6 dark:bg-slate-900/90"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {type === 'in' ? '+ Stock In' : '− Stock Out'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Material</label>
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40"
            >
              {items.map((item) => (
                <option key={item.id} value={item.id}>{item.name} (Stock: {item.currentStock} {item.unit})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Quantity</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Reference Job</label>
              <select
                value={jobRef}
                onChange={(e) => setJobRef(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 font-medium focus:outline-none"
              >
                <option value="">None</option>
                {jobs.map((j) => <option key={j.id} value={j.id}>{j.id}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary text-xs">Cancel</button>
            <button type="submit" className="btn-primary text-xs">
              {type === 'in' ? 'Stock In' : 'Stock Out'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ─── Main Inventory Page ─────────────────────────────────────────────────────
export default function Inventory() {
  const [activeTab, setActiveTab] = useState<'raw' | 'finished'>('raw')
  const [stockModal, setStockModal] = useState<'in' | 'out' | null>(null)
  const [rmList, setRmList] = useState<RawMaterial[]>(rawMaterials)
  const [fgList] = useState<FinishedGood[]>(finishedGoods)

  const handleStockUpdate = (itemId: string, quantity: number, _jobRef: string) => {
    setRmList((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newStock = stockModal === 'in'
            ? item.currentStock + quantity
            : Math.max(0, item.currentStock - quantity)
          const newStatus = newStock <= 0 ? 'Out of Stock' : newStock < item.reorderLevel ? 'Low Stock' : 'OK'
          return { ...item, currentStock: newStock, status: newStatus as RawMaterial['status'] }
        }
        return item
      })
    )
  }

  const lowStockCount = rmList.filter((m) => m.status === 'Low Stock').length
  const outOfStockCount = rmList.filter((m) => m.status === 'Out of Stock').length
  const totalValue = rmList.reduce((sum, m) => sum + m.currentStock * m.unitCost, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Inventory Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track raw materials and finished goods stock levels
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setStockModal('out')} className="btn-secondary text-xs">
            <Minus className="w-4 h-4" />
            <span>Stock Out</span>
          </button>
          <button onClick={() => setStockModal('in')} className="btn-primary text-xs">
            <Plus className="w-4 h-4" />
            <span>Stock In</span>
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <GlassCard className="p-4" glow="amber">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Stock Value</span>
              <div className="p-2 rounded-xl kpi-amber">
                <Package className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-2">{formatCurrency(totalValue)}</p>
          </GlassCard>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Low Stock Items</span>
              <div className="p-2 rounded-xl kpi-amber">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-amber-600 mt-2">{lowStockCount}</p>
          </GlassCard>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Out of Stock</span>
              <div className="p-2 rounded-xl kpi-rose">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-red-600 mt-2">{outOfStockCount}</p>
          </GlassCard>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('raw')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'raw' ? 'bg-white dark:bg-slate-700 text-orange-600 shadow-sm' : 'text-slate-500'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          Raw Materials
        </button>
        <button
          onClick={() => setActiveTab('finished')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'finished' ? 'bg-white dark:bg-slate-700 text-orange-600 shadow-sm' : 'text-slate-500'
          }`}
        >
          <Boxes className="w-3.5 h-3.5" />
          Finished Goods
        </button>
      </div>

      {/* Raw Materials Table */}
      {activeTab === 'raw' && (
        <GlassCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-semibold bg-slate-50/50 dark:bg-slate-800/30">
                  <th className="py-3.5 px-4">Material Name</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Unit</th>
                  <th className="py-3.5 px-4 text-right">Current Stock</th>
                  <th className="py-3.5 px-4 text-right">Reorder Level</th>
                  <th className="py-3.5 px-4 text-right">Unit Cost</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {rmList.map((item, i) => {
                  const cfg = stockStatusConfig[item.status]
                  const Icon = cfg.icon
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">{item.name}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 text-[10px]">{item.sku}</td>
                      <td className="py-3.5 px-4 text-slate-500">{item.unit}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white">{item.currentStock}</td>
                      <td className="py-3.5 px-4 text-right text-slate-500">{item.reorderLevel}</td>
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(item.unitCost)}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border', cfg.color)}>
                          <Icon className="w-3 h-3" />
                          {item.status}
                        </span>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Finished Goods Table */}
      {activeTab === 'finished' && (
        <GlassCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-semibold bg-slate-50/50 dark:bg-slate-800/30">
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Unit</th>
                  <th className="py-3.5 px-4 text-right">Current Stock</th>
                  <th className="py-3.5 px-4">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {fgList.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">{item.name}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[10px]">{item.sku}</td>
                    <td className="py-3.5 px-4 text-slate-500">{item.unit}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white">{item.currentStock}</td>
                    <td className="py-3.5 px-4 text-slate-500">{formatDate(item.lastUpdated)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Stock Modal */}
      <AnimatePresence>
        {stockModal && (
          <StockModal
            type={stockModal}
            items={rmList}
            onClose={() => setStockModal(null)}
            onSave={handleStockUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
