import React, { useState } from 'react'
import { Package, Layers, AlertTriangle, Plus, Search, Minus, Pencil } from 'lucide-react'
import { finishedGoods } from '../lib/data'
import { GlassCard } from '../components/ui/GlassCard'
import { GlowButton } from '../components/ui/GlowButton'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useToast } from '../components/ui/Toast'
import { formatCurrency } from '../lib/utils'
import { useAppData } from '../context/AppDataContext'
import { Modal } from '../components/ui/Modal'

export function Inventory() {
  const { showToast } = useToast()
  const { rawMaterials, addRawMaterial, updateRawMaterial } = useAppData()
  const [tab, setTab] = useState<'raw' | 'finished'>('raw')
  const [search, setSearch] = useState('')
  const [stockModal, setStockModal] = useState<'in' | 'out' | null>(null)
  const [addModal, setAddModal] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState('')
  const [adjustment, setAdjustment] = useState(1)
  const [newMaterial, setNewMaterial] = useState({ name: '', sku: '', unit: 'kg', currentStock: 0, reorderLevel: 0, unitCost: 0 })

  const filteredRaw = rawMaterials.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.sku.toLowerCase().includes(search.toLowerCase()))
  const filteredFinished = finishedGoods.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.sku.toLowerCase().includes(search.toLowerCase()))

  const applyStockUpdate = (mode: 'in' | 'out') => {
    const material = rawMaterials.find(item => item.id === selectedMaterial)
    if (!material || adjustment <= 0) return
    const currentStock = mode === 'in' ? material.currentStock + adjustment : Math.max(0, material.currentStock - adjustment)
    updateRawMaterial(material.id, { currentStock })
    setStockModal(null)
    showToast(`${material.name} stock updated successfully.`, 'success')
  }

  const createMaterial = () => {
    if (!newMaterial.name || !newMaterial.sku) { showToast('Material name and SKU are required.', 'warning'); return }
    addRawMaterial(newMaterial)
    setNewMaterial({ name: '', sku: '', unit: 'kg', currentStock: 0, reorderLevel: 0, unitCost: 0 })
    setAddModal(false)
    showToast('New material added to inventory.', 'success')
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory Tracking</h1>
          <p className="page-subtitle">Real-time stock management for raw stock materials and finished component goods.</p>
        </div>
        <div className="flex gap-2"><GlowButton size="sm" variant="outline" icon={<Plus size={16} />} onClick={() => setAddModal(true)}>Add Material</GlowButton><GlowButton size="sm" icon={<Pencil size={16} />} onClick={() => setStockModal('in')}>Update Stock</GlowButton></div>
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
                <th className="text-right">Update</th>
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
                  <td className="text-right"><button onClick={() => { setSelectedMaterial(rm.id); setStockModal('in') }} className="text-xs text-accent hover:text-highlight">Stock In / Out</button></td>
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

      <Modal open={Boolean(stockModal)} onClose={() => setStockModal(null)} title={stockModal === 'out' ? 'Stock Out' : 'Update Stock'}>
        <div className="space-y-4"><select className="glass-select" value={selectedMaterial} onChange={event => setSelectedMaterial(event.target.value)}><option value="">Select material</option>{rawMaterials.map(material => <option key={material.id} value={material.id}>{material.name} ({material.currentStock} {material.unit})</option>)}</select><input type="number" min="1" className="glass-input" value={adjustment} onChange={event => setAdjustment(Number(event.target.value))} placeholder="Quantity" /><div className="flex gap-2"><GlowButton className="flex-1" icon={<Plus size={15} />} onClick={() => applyStockUpdate('in')}>Stock In</GlowButton><GlowButton className="flex-1" variant="outline" icon={<Minus size={15} />} onClick={() => applyStockUpdate('out')}>Stock Out</GlowButton></div></div>
      </Modal>

      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add Raw Material">
        <div className="grid grid-cols-2 gap-3"><label className="col-span-2 text-xs text-glass-dim">Material Name<input className="glass-input mt-1" placeholder="e.g. Drill Bit" value={newMaterial.name} onChange={event => setNewMaterial({ ...newMaterial, name: event.target.value })} /></label><label className="text-xs text-glass-dim">SKU / Material Code<input className="glass-input mt-1" placeholder="e.g. RM-DRILL-01" value={newMaterial.sku} onChange={event => setNewMaterial({ ...newMaterial, sku: event.target.value })} /></label><label className="text-xs text-glass-dim">Unit<input className="glass-input mt-1" placeholder="e.g. kg, pcs" value={newMaterial.unit} onChange={event => setNewMaterial({ ...newMaterial, unit: event.target.value })} /></label><label className="text-xs text-glass-dim">Opening Stock<input type="number" className="glass-input mt-1" placeholder="e.g. 50" value={newMaterial.currentStock} onChange={event => setNewMaterial({ ...newMaterial, currentStock: Number(event.target.value) })} /></label><label className="text-xs text-glass-dim">Reorder Level<input type="number" className="glass-input mt-1" placeholder="e.g. 10" value={newMaterial.reorderLevel} onChange={event => setNewMaterial({ ...newMaterial, reorderLevel: Number(event.target.value) })} /></label><label className="col-span-2 text-xs text-glass-dim">Unit Cost (₹)<input type="number" className="glass-input mt-1" placeholder="e.g. 250" value={newMaterial.unitCost} onChange={event => setNewMaterial({ ...newMaterial, unitCost: Number(event.target.value) })} /></label><GlowButton className="col-span-2" onClick={createMaterial}>Add Material</GlowButton></div>
      </Modal>
    </div>
  )
}
