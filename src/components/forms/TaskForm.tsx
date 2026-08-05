import React, { useState } from 'react'
import { GlowButton } from '../ui/GlowButton'
import type { Task, Priority } from '../../lib/data'

interface TaskFormProps {
  initial?: Partial<Task>
  onSubmit: (data: Omit<Task, 'id'>) => void
  onCancel: () => void
  loading?: boolean
  employees: string[]
}

const priorities: Priority[] = ['High', 'Medium', 'Low']
const columns: Task['column'][] = ['Pending', 'In Progress', 'Review', 'Completed']

export function TaskForm({ initial, onSubmit, onCancel, loading, employees }: TaskFormProps) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    assignee: initial?.assignee || '',
    priority: initial?.priority || 'Medium' as Priority,
    dueDate: initial?.dueDate || new Date().toISOString().split('T')[0],
    column: initial?.column || 'Pending' as Task['column'],
    tags: initial?.tags ? initial.tags.join(', ') : '',
  })

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const tagArray = form.tags.split(',').map(t => t.trim()).filter(Boolean)
    onSubmit({
      ...form,
      tags: tagArray,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Task Title *</label>
          <input className="glass-input" placeholder="Set up CNC program" value={form.title} onChange={e => set('title', e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Description</label>
          <textarea className="glass-input resize-none" rows={2} placeholder="Task details..." value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Assignee</label>
          <select className="glass-select" value={form.assignee} onChange={e => set('assignee', e.target.value)}>
            <option value="">Select Assignee</option>
            {employees.map(emp => <option key={emp}>{emp}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Priority</label>
          <select className="glass-select" value={form.priority} onChange={e => set('priority', e.target.value)}>
            {priorities.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Due Date *</label>
          <input type="date" className="glass-input" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Stage / Column</label>
          <select className="glass-select" value={form.column} onChange={e => set('column', e.target.value)}>
            {columns.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-glass-dim mb-1.5">Tags (comma-separated)</label>
          <input className="glass-input" placeholder="CNC, Setup, Maintenance" value={form.tags} onChange={e => set('tags', e.target.value)} />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <GlowButton type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={loading}>Cancel</GlowButton>
        <GlowButton type="submit" className="flex-1" loading={loading}>{initial?.id ? 'Update Task' : 'Add Task'}</GlowButton>
      </div>
    </form>
  )
}
