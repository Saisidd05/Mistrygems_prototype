import React, { useState } from 'react'
import { Building2, ClipboardList, FileText, Truck, Plus, X } from 'lucide-react'
import { GlassCard, StatCard } from '../../components/ui/GlassCard'
import { useAuth } from '../../context/AuthContext'
import { IndustryRequirement, useIndustryData } from '../../context/IndustryDataContext'
import { GlowButton } from '../../components/ui/GlowButton'

export function IndustryDashboard() {
  const { user } = useAuth()
  const { requirements } = useIndustryData()
  const active = requirements.filter(item => item.status !== 'Closed').length
  const quotations = requirements.reduce((total, item) => total + item.quotationsReceived, 0)
  const ongoing = requirements.filter(item => item.status === 'In Production').length
  const completed = requirements.filter(item => item.status === 'Closed').length
  return <div className="space-y-6">
    <div className="glass-card p-6 border-glass-bright"><span className="glass-badge mb-2">Industry workspace</span><h1 className="text-2xl font-bold font-sora gradient-text-bright">Welcome, {user?.name}</h1><p className="text-xs text-glass-dim mt-1">Manage industry requirements, vendors and purchase orders from one dedicated portal.</p></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Requirements" value={requirements.length} icon={<ClipboardList size={20} className="text-accent" />} sub="All posted requirements" color="blue" />
      <StatCard label="Active Requirements" value={active} icon={<ClipboardList size={20} className="text-cyan-400" />} sub="Awaiting completion" color="cyan" />
      <StatCard label="Quotations Received" value={quotations} icon={<Truck size={20} className="text-emerald-400" />} sub="Across your requirements" color="green" />
      <StatCard label="Vendors Contacted" value="0" icon={<Building2 size={20} className="text-accent" />} sub="Your vendor network" color="blue" />
      <StatCard label="Ongoing Orders" value={ongoing} icon={<FileText size={20} className="text-amber-400" />} sub="In production" color="amber" />
      <StatCard label="Completed Orders" value={completed} icon={<FileText size={20} className="text-emerald-400" />} sub="Closed requirements" color="green" />
      <StatCard label="Notifications" value="0" icon={<Building2 size={20} className="text-accent" />} sub="No unread updates" color="cyan" />
    </div>
    <GlassCard className="p-6"><h2 className="text-sm font-bold font-sora text-highlight">Industry activity</h2><p className="py-12 text-center text-sm text-glass-dim">No industry activity yet. Create a requirement to get started.</p></GlassCard>
  </div>
}

const initialRequirement = { jobTitle: '', description: '', category: '', materialSpecification: '', manufacturingProcess: '', quantity: 1, unit: 'Pieces', certifications: '', deliveryDate: '', deliveryLocation: '', budget: undefined as number | undefined, notes: '', drawingFile: '', technicalFile: '' }

export function IndustryRequirements({ createMode = false }: { createMode?: boolean }) {
  const { requirements, createRequirement, updateRequirement, deleteRequirement, loading } = useIndustryData(); const [showForm, setShowForm] = useState(createMode); const [form, setForm] = useState(initialRequirement); const [editingId, setEditingId] = useState<string | null>(null); const [saving, setSaving] = useState(false)
  const set = (key: keyof typeof initialRequirement, value: string | number | undefined) => setForm(current => ({ ...current, [key]: value }))
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setSaving(true); try { if (editingId) await updateRequirement(editingId, form); else await createRequirement(form); setForm(initialRequirement); setEditingId(null); setShowForm(false) } finally { setSaving(false) } }
  if (showForm) return <div className="space-y-5"><div className="flex justify-between items-center"><div><h1 className="page-title">{editingId ? 'Edit Manufacturing Requirement' : 'Post Manufacturing Requirement'}</h1><p className="page-subtitle">Share technical details with matched MSME workshops.</p></div><GlowButton variant="outline" size="sm" onClick={() => { setShowForm(false); setEditingId(null) }} icon={<X size={14} />}>Cancel</GlowButton></div><GlassCard className="p-6"><form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">{[
    ['Job Title', 'jobTitle'], ['Category', 'category'], ['Material Specification', 'materialSpecification'], ['Manufacturing Process', 'manufacturingProcess'], ['Quantity', 'quantity'], ['Unit', 'unit'], ['Required Certifications', 'certifications'], ['Delivery Date', 'deliveryDate'], ['Delivery Location', 'deliveryLocation'], ['Budget (optional)', 'budget'],
  ].map(([label, key]) => <label key={key} className="text-xs text-glass-dim">{label}<input required={key !== 'budget'} type={key === 'quantity' || key === 'budget' ? 'number' : key === 'deliveryDate' ? 'date' : 'text'} className="glass-input mt-1" value={form[key as keyof typeof form] as string | number | undefined || ''} onChange={e => set(key as keyof typeof initialRequirement, key === 'quantity' || key === 'budget' ? (e.target.value ? Number(e.target.value) : undefined) : e.target.value)} /></label>)}
    <label className="text-xs text-glass-dim">Component Drawing / CAD Upload<input type="file" className="mt-1 block w-full text-xs" onChange={e => set('drawingFile', e.target.files?.[0]?.name || '')} /></label><label className="text-xs text-glass-dim">Technical Documents Upload<input type="file" className="mt-1 block w-full text-xs" onChange={e => set('technicalFile', e.target.files?.[0]?.name || '')} /></label>
    <label className="md:col-span-2 text-xs text-glass-dim">Job Description<textarea required className="glass-input mt-1 min-h-24" value={form.description} onChange={e => set('description', e.target.value)} /></label><label className="md:col-span-2 text-xs text-glass-dim">Additional Notes<textarea className="glass-input mt-1 min-h-20" value={form.notes} onChange={e => set('notes', e.target.value)} /></label>
    <div className="md:col-span-2 flex justify-end"><GlowButton type="submit" loading={saving}>{editingId ? 'Save Changes' : 'Post Requirement'}</GlowButton></div></form></GlassCard></div>
  return <div className="space-y-5"><div className="flex justify-between items-center"><div><h1 className="page-title">My Requirements</h1><p className="page-subtitle">Private requirements posted by your company.</p></div><GlowButton size="sm" icon={<Plus size={14} />} onClick={() => setShowForm(true)}>Post Requirement</GlowButton></div><GlassCard className="p-4 overflow-x-auto"><table className="glass-table min-w-[760px]"><thead><tr><th>Requirement ID</th><th>Job Title</th><th>Created</th><th>Status</th><th>Quotations</th><th>Workshop</th><th>Delivery</th><th>Actions</th></tr></thead><tbody>{requirements.map(item => <tr key={item.id}><td className="font-mono text-xs text-accent">{item.id}</td><td>{item.jobTitle}</td><td>{new Date(item.createdAt).toLocaleDateString()}</td><td>{item.status}</td><td>{item.quotationsReceived}</td><td>{item.assignedWorkshop || 'Unassigned'}</td><td>{item.deliveryDate}</td><td className="space-x-2"><button className="text-accent" onClick={() => { setForm({ jobTitle: item.jobTitle, description: item.description, category: item.category, materialSpecification: item.materialSpecification, manufacturingProcess: item.manufacturingProcess, quantity: item.quantity, unit: item.unit, certifications: item.certifications, deliveryDate: item.deliveryDate, deliveryLocation: item.deliveryLocation, budget: item.budget, notes: item.notes || '', drawingFile: item.drawingFile || '', technicalFile: item.technicalFile || '' }); setEditingId(item.id); setShowForm(true) }}>Edit</button><button className="text-accent" onClick={() => void updateRequirement(item.id, { status: item.status === 'Closed' ? 'Open' : 'Closed' })}>{item.status === 'Closed' ? 'Reopen' : 'Close'}</button><button className="text-red-400" onClick={() => void deleteRequirement(item.id)}>Delete</button></td></tr>)}{!requirements.length && <tr><td colSpan={8} className="py-10 text-center text-glass-dim">{loading ? 'Loading requirements...' : 'No requirements posted yet.'}</td></tr>}</tbody></table></GlassCard></div>
}

export function IndustrySection({ title, description }: { title: string; description: string }) {
  return <GlassCard className="p-6"><h1 className="text-xl font-bold font-sora gradient-text-bright">{title}</h1><p className="mt-1 text-xs text-glass-dim">{description}</p><p className="py-16 text-center text-sm text-glass-dim">No records yet.</p></GlassCard>
}
