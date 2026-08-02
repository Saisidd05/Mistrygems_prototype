import { useState, useCallback } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { initialTasks, Task, Priority, employees } from '@/lib/data'
import { PriorityBadge } from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { Plus, Clock, User, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  useDroppable,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const columns: Array<{ id: Task['column']; title: string; color: string }> = [
  { id: 'Pending', title: 'Pending', color: 'border-amber-500/40 text-amber-600' },
  { id: 'In Progress', title: 'In Progress', color: 'border-blue-500/40 text-blue-600' },
  { id: 'Review', title: 'Review / QC', color: 'border-indigo-500/40 text-indigo-600' },
  { id: 'Completed', title: 'Completed', color: 'border-emerald-500/40 text-emerald-600' },
]

// ─── Sortable Task Card ────────────────────────────────────────────────────
function SortableTaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCardContent task={task} />
    </div>
  )
}

// ─── Task Card Content (shared between sortable and overlay) ─────────────
function TaskCardContent({ task }: { task: Task }) {
  return (
    <GlassCard className="p-4 cursor-grab active:cursor-grabbing hover:border-orange-500/40">
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
    </GlassCard>
  )
}

// ─── Droppable Column ────────────────────────────────────────────────────────
function DroppableColumn({
  column,
  tasks,
  isOver,
  onAddClick,
}: {
  column: typeof columns[0]
  tasks: Task[]
  isOver: boolean
  onAddClick: () => void
}) {
  const { setNodeRef } = useDroppable({ id: column.id })

  return (
    <div
      ref={setNodeRef}
      className={`kanban-col flex flex-col transition-all duration-200 ${isOver ? 'drag-over' : ''}`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {column.title}
          </h3>
          <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddClick}
          className="p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-400"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task Items */}
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

// ─── New Task Modal ──────────────────────────────────────────────────────────
function NewTaskModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (task: Omit<Task, 'id'>) => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignee, setAssignee] = useState(employees[0]?.name || '')
  const [priority, setPriority] = useState<Priority>('Medium')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({
      title,
      description,
      assignee,
      priority,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      column: 'Pending',
      tags: [],
    })
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
          <h2 className="text-base font-bold text-slate-900 dark:text-white">New Task</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title..."
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task details..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Assignee</label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 font-medium focus:outline-none"
              >
                {employees.map((e) => (
                  <option key={e.id} value={e.name}>{e.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 font-medium focus:outline-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary text-xs">Cancel</button>
            <button type="submit" className="btn-primary text-xs">Create Task</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ─── Main Tasks Page ─────────────────────────────────────────────────────────
export default function Tasks() {
  const { userRole } = useAuth()
  const [taskList, setTaskList] = useState<Task[]>(initialTasks)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [overColumn, setOverColumn] = useState<string | null>(null)
  const [showNewTask, setShowNewTask] = useState(false)

  // Filter tasks for employee role
  const filteredTasks = userRole === 'employee'
    ? taskList // In production, filter by logged-in employee name
    : taskList

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = filteredTasks.find((t) => t.id === event.active.id)
    setActiveTask(task || null)
  }, [filteredTasks])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const overId = event.over?.id as string
    if (columns.some((c) => c.id === overId)) {
      setOverColumn(overId)
    } else {
      // Find which column the over task belongs to
      const overTask = filteredTasks.find((t) => t.id === overId)
      setOverColumn(overTask?.column || null)
    }
  }, [filteredTasks])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveTask(null)
    setOverColumn(null)

    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Determine target column
    let targetColumn: Task['column'] | null = null
    if (columns.some((c) => c.id === overId)) {
      targetColumn = overId as Task['column']
    } else {
      const overTask = filteredTasks.find((t) => t.id === overId)
      targetColumn = overTask?.column || null
    }

    if (targetColumn) {
      setTaskList((prev) =>
        prev.map((t) => (t.id === activeId ? { ...t, column: targetColumn! } : t))
      )
    }
  }, [filteredTasks])

  const handleAddTask = (taskData: Omit<Task, 'id'>) => {
    const newId = `TASK-${String(taskList.length + 1).padStart(3, '0')}`
    setTaskList((prev) => [...prev, { ...taskData, id: newId }])
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
            Drag tasks between columns to update their status
          </p>
        </div>
        <button onClick={() => setShowNewTask(true)} className="btn-primary text-xs">
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Kanban Columns with DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.column === col.id)
            return (
              <DroppableColumn
                key={col.id}
                column={col}
                tasks={colTasks}
                isOver={overColumn === col.id}
                onAddClick={() => setShowNewTask(true)}
              />
            )
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="w-64 rotate-3">
              <TaskCardContent task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* New Task Modal */}
      <AnimatePresence>
        {showNewTask && (
          <NewTaskModal
            onClose={() => setShowNewTask(false)}
            onSave={handleAddTask}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
