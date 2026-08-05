import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  seedJobs, seedEmployees, seedCustomers, seedTasks, seedNotifications, seedInvoices,
  type Job, type Employee, type Customer, type Task, type Notification, type Invoice
} from '../lib/data'
import { generateId } from '../lib/utils'

interface AppDataContextType {
  // Jobs
  jobs: Job[]
  addJob: (j: Omit<Job, 'id' | 'createdAt'>) => void
  updateJob: (id: string, updates: Partial<Job>) => void
  deleteJob: (id: string) => void

  // Employees
  employees: Employee[]
  addEmployee: (e: Omit<Employee, 'id'>) => void
  updateEmployee: (id: string, updates: Partial<Employee>) => void
  deleteEmployee: (id: string) => void

  // Customers
  customers: Customer[]
  addCustomer: (c: Omit<Customer, 'id'>) => void
  updateCustomer: (id: string, updates: Partial<Customer>) => void
  deleteCustomer: (id: string) => void

  // Tasks
  tasks: Task[]
  addTask: (t: Omit<Task, 'id'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  moveTask: (id: string, column: Task['column']) => void

  // Notifications
  notifications: Notification[]
  markNotificationRead: (id: string) => void
  markAllRead: () => void
  deleteNotification: (id: string) => void

  // Invoices
  invoices: Invoice[]
  addInvoice: (inv: Omit<Invoice, 'id' | 'createdAt'>) => void
  updateInvoice: (id: string, updates: Partial<Invoice>) => void
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined)

function loadData<T>(key: string, seed: T[]): T[] {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : seed
  } catch {
    return seed
  }
}

function saveData<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(() => loadData('mg_jobs', seedJobs))
  const [employees, setEmployees] = useState<Employee[]>(() => loadData('mg_employees', seedEmployees))
  const [customers, setCustomers] = useState<Customer[]>(() => loadData('mg_customers', seedCustomers))
  const [tasks, setTasks] = useState<Task[]>(() => loadData('mg_tasks', seedTasks))
  const [notifications, setNotifications] = useState<Notification[]>(() => loadData('mg_notifications', seedNotifications))
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadData('mg_invoices', seedInvoices))

  useEffect(() => { saveData('mg_jobs', jobs) }, [jobs])
  useEffect(() => { saveData('mg_employees', employees) }, [employees])
  useEffect(() => { saveData('mg_customers', customers) }, [customers])
  useEffect(() => { saveData('mg_tasks', tasks) }, [tasks])
  useEffect(() => { saveData('mg_notifications', notifications) }, [notifications])
  useEffect(() => { saveData('mg_invoices', invoices) }, [invoices])

  // ── Jobs ──
  const addJob = useCallback((j: Omit<Job, 'id' | 'createdAt'>) => {
    setJobs(prev => [...prev, { ...j, id: generateId('JOB'), createdAt: new Date().toISOString().split('T')[0] }])
  }, [])
  const updateJob = useCallback((id: string, updates: Partial<Job>) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j))
  }, [])
  const deleteJob = useCallback((id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id))
  }, [])

  // ── Employees ──
  const addEmployee = useCallback((e: Omit<Employee, 'id'>) => {
    setEmployees(prev => [...prev, { ...e, id: generateId('EMP') }])
  }, [])
  const updateEmployee = useCallback((id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
  }, [])
  const deleteEmployee = useCallback((id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id))
  }, [])

  // ── Customers ──
  const addCustomer = useCallback((c: Omit<Customer, 'id'>) => {
    setCustomers(prev => [...prev, { ...c, id: generateId('CUST') }])
  }, [])
  const updateCustomer = useCallback((id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }, [])
  const deleteCustomer = useCallback((id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id))
  }, [])

  // ── Tasks ──
  const addTask = useCallback((t: Omit<Task, 'id'>) => {
    setTasks(prev => [...prev, { ...t, id: generateId('TASK') }])
  }, [])
  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }, [])
  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])
  const moveTask = useCallback((id: string, column: Task['column']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, column } : t))
  }, [])

  // ── Notifications ──
  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])
  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  // ── Invoices ──
  const addInvoice = useCallback((inv: Omit<Invoice, 'id' | 'createdAt'>) => {
    setInvoices(prev => [...prev, { ...inv, id: generateId('INV'), createdAt: new Date().toISOString().split('T')[0] }])
  }, [])
  const updateInvoice = useCallback((id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i))
  }, [])

  return (
    <AppDataContext.Provider value={{
      jobs, addJob, updateJob, deleteJob,
      employees, addEmployee, updateEmployee, deleteEmployee,
      customers, addCustomer, updateCustomer, deleteCustomer,
      tasks, addTask, updateTask, deleteTask, moveTask,
      notifications, markNotificationRead, markAllRead, deleteNotification,
      invoices, addInvoice, updateInvoice,
    }}>
      {children}
    </AppDataContext.Provider>
  )
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used inside AppDataProvider')
  return ctx
}
