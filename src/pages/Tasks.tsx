import React, { useState } from 'react'
import { ClipboardList, Plus, Search, CheckCircle2, Clock, AlertTriangle, Calendar, User, Edit2, Trash2 } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { GlassCard } from '../components/ui/GlassCard'
import { GlowButton } from '../components/ui/GlowButton'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { TaskForm } from '../components/forms/TaskForm'
import { useToast } from '../components/ui/Toast'
import { formatDate } from '../lib/utils'
import type { Task } from '../lib/data'

const columns: Task['column'][] = ['Pending', 'In Progress', 'Review', 'Completed']

export function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, moveTask, employees } = useAppData()
  const { showToast } = useToast()

  const [openModal, setOpenModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [targetColumn, setTargetColumn] = useState<Task['column']>('Pending')

  const employeeNames = employees.map(e => e.name)

  const handleFormSubmit = (data: Omit<Task, 'id'>) => {
    if (editingTask) {
      updateTask(editingTask.id, data)
      showToast(`Task "${data.title}" updated.`, 'success')
    } else {
      addTask(data)
      showToast('New task added to board!', 'success')
    }
    setOpenModal(false)
    setEditingTask(null)
  }

  const handleDelete = () => {
    if (deletingId) {
      deleteTask(deletingId)
      showToast('Task removed from board.', 'warning')
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Operational Task Board</h1>
          <p className="page-subtitle">Assign daily machining, quality checks, and maintenance tasks to workers.</p>
        </div>
        <GlowButton size="sm" icon={<Plus size={16} />} onClick={() => { setEditingTask(null); setTargetColumn('Pending'); setOpenModal(true); }}>
          New Task
        </GlowButton>
      </div>

      {/* Kanban Columns */}
      <div className="kanban-board">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.column === col)
          return (
            <div key={col} className="kanban-column flex flex-col gap-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl glass-card bg-white/5 border-glass">
                <span className="text-xs font-bold text-highlight">{col}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-accent bg-[#00B4D8]/10 px-2 py-0.5 rounded-full">{colTasks.length}</span>
                  <button
                    onClick={() => { setEditingTask(null); setTargetColumn(col); setOpenModal(true); }}
                    className="p-1 rounded hover:bg-white/10 text-glass-dim hover:text-highlight"
                    title={`Add task to ${col}`}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 flex-1 min-h-[400px]">
                {colTasks.map(task => (
                  <GlassCard key={task.id} className="p-4 hover:border-accent/40 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-mono text-[10px] text-glass-dim">{task.id}</span>
                        <StatusBadge status={task.priority} />
                      </div>

                      <h4 className="text-xs font-bold text-highlight mb-1">{task.title}</h4>
                      {task.description && <p className="text-[11px] text-glass-dim line-clamp-2 mb-2">{task.description}</p>}

                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {task.tags.map(tag => (
                            <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-glass-dim border border-glass/10">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-glass/10 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1 text-glass-dim">
                        <User size={12} className="text-accent" />
                        <span>{task.assignee || 'Unassigned'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-glass-dim">
                        <Calendar size={12} />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      {/* Move Column Selector */}
                      <select
                        className="glass-select text-[10px] py-1 px-2 w-auto bg-black/40"
                        value={task.column}
                        onChange={e => { moveTask(task.id, e.target.value as Task['column']); showToast(`Moved task to ${e.target.value}`, 'info'); }}
                      >
                        {columns.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>

                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditingTask(task); setOpenModal(true); }} className="p-1 hover:bg-white/10 rounded text-glass-dim hover:text-accent">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => setDeletingId(task.id)} className="p-1 hover:bg-white/10 rounded text-glass-dim hover:text-red-400">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Task Modal */}
      <Modal open={openModal} onClose={() => { setOpenModal(false); setEditingTask(null); }} title={editingTask ? 'Edit Task' : 'Add New Task'}>
        <TaskForm
          initial={editingTask || { column: targetColumn }}
          onSubmit={handleFormSubmit}
          onCancel={() => { setOpenModal(false); setEditingTask(null); }}
          employees={employeeNames}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        message="Are you sure you want to remove this task?"
      />
    </div>
  )
}
