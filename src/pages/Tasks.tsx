import { useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { initialTasks, Task, Priority } from '@/lib/data'
import { PriorityBadge } from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/utils'
import { Plus, Clock, User, CheckCircle2, MoreHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'

const columns: Array<{ id: Task['column']; title: string; color: string }> = [
  { id: 'Pending', title: 'Pending', color: 'border-amber-500/40 text-amber-600' },
  { id: 'In Progress', title: 'In Progress', color: 'border-blue-500/40 text-blue-600' },
  { id: 'Review', title: 'Review / QC', color: 'border-indigo-500/40 text-indigo-600' },
  { id: 'Completed', title: 'Completed', color: 'border-emerald-500/40 text-emerald-600' },
]

export default function Tasks() {
  const [taskList, setTaskList] = useState<Task[]>(initialTasks)

  const moveTask = (taskId: string, newColumn: Task['column']) => {
    setTaskList((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, column: newColumn } : t))
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Task Board
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kanban workflow manager — track tasks from Pending to Completion
          </p>
        </div>
        <button className="btn-primary text-xs">
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col) => {
          const colTasks = taskList.filter((t) => t.column === col.id)

          return (
            <div key={col.id} className="kanban-col flex flex-col">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {col.title}
                  </h3>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {colTasks.length}
                  </span>
                </div>
                <button className="p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-400">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Task Items */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                {colTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <GlassCard className="p-4 cursor-pointer hover:border-blue-500/40">
                      <div className="flex items-start justify-between gap-2">
                        <PriorityBadge priority={task.priority} />
                        <span className="text-[10px] font-mono text-slate-400">{task.id}</span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-2 line-clamp-2">
                        {task.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {task.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          {task.assignee}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {formatDate(task.dueDate)}
                        </span>
                      </div>

                      {/* Column Move Selector */}
                      <div className="mt-3 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Move stage:</span>
                        <select
                          value={task.column}
                          onChange={(e) => moveTask(task.id, e.target.value as Task['column'])}
                          className="bg-slate-100 dark:bg-slate-800 border-none rounded px-1.5 py-0.5 font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Review">Review</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
