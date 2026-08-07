import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getAccountType, useAuth } from './AuthContext'
import { database } from '../lib/database'
import { generateId } from '../lib/utils'
import type { Customer, Employee, FinishedGood, Invoice, Job, Notification, Quotation, RawMaterial, Task } from '../lib/data'

interface AppDataContextType {
  jobs: Job[]; addJob: (value: Omit<Job, 'id' | 'createdAt'>) => void; updateJob: (id: string, value: Partial<Job>) => void; deleteJob: (id: string) => void
  employees: Employee[]; addEmployee: (value: Omit<Employee, 'id'>) => void; updateEmployee: (id: string, value: Partial<Employee>) => void; deleteEmployee: (id: string) => void
  customers: Customer[]; addCustomer: (value: Omit<Customer, 'id'>) => void; updateCustomer: (id: string, value: Partial<Customer>) => void; deleteCustomer: (id: string) => void
  tasks: Task[]; addTask: (value: Omit<Task, 'id'>) => void; updateTask: (id: string, value: Partial<Task>) => void; deleteTask: (id: string) => void; moveTask: (id: string, column: Task['column']) => void
  notifications: Notification[]; markNotificationRead: (id: string) => void; markAllRead: () => void; deleteNotification: (id: string) => void
  invoices: Invoice[]; addInvoice: (value: Omit<Invoice, 'id' | 'createdAt'>) => void; updateInvoice: (id: string, value: Partial<Invoice>) => void
  rawMaterials: RawMaterial[]; finishedGoods: FinishedGood[]; addRawMaterial: (value: Omit<RawMaterial, 'id' | 'status'>) => void; updateRawMaterial: (id: string, value: Partial<RawMaterial>) => void
  quotations: Quotation[]; addQuotation: (value: Omit<Quotation, 'id' | 'createdAt'>) => void
  loading: boolean
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined)
const id = (prefix: string) => generateId(prefix)
const stockStatus = (value: Pick<RawMaterial, 'currentStock' | 'reorderLevel'>): RawMaterial['status'] => value.currentStock <= 0 ? 'Out of Stock' : value.currentStock < value.reorderLevel ? 'Low Stock' : 'OK'

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([]); const [employees, setEmployees] = useState<Employee[]>([]); const [customers, setCustomers] = useState<Customer[]>([])
  const [tasks, setTasks] = useState<Task[]>([]); const [notifications, setNotifications] = useState<Notification[]>([]); const [invoices, setInvoices] = useState<Invoice[]>([])
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]); const [finishedGoods, setFinishedGoods] = useState<FinishedGood[]>([]); const [quotations, setQuotations] = useState<Quotation[]>([])

  useEffect(() => {
    if (!isAuthenticated || getAccountType(user) !== 'workshop') { setJobs([]); setEmployees([]); setCustomers([]); setTasks([]); setNotifications([]); setInvoices([]); setRawMaterials([]); setFinishedGoods([]); setQuotations([]); return }
    let active = true; setLoading(true)
    Promise.all([
      database.list<Job>('jobs'), database.list<Employee>('employees'), database.list<Customer>('customers'), database.list<Task>('tasks'),
      database.list<Notification>('notifications'), database.list<Invoice>('invoices'), database.list<RawMaterial>('rawMaterials'), database.list<FinishedGood>('finishedGoods'), database.list<Quotation>('quotations'),
    ]).then(([nextJobs, nextEmployees, nextCustomers, nextTasks, nextNotifications, nextInvoices, nextMaterials, nextGoods, nextQuotations]) => {
      if (!active) return; setJobs(nextJobs); setEmployees(nextEmployees); setCustomers(nextCustomers); setTasks(nextTasks); setNotifications(nextNotifications); setInvoices(nextInvoices); setRawMaterials(nextMaterials); setFinishedGoods(nextGoods); setQuotations(nextQuotations)
    }).catch(error => console.error('Unable to load private workspace data:', error)).finally(() => active && setLoading(false))
    return () => { active = false }
  }, [isAuthenticated, user])

  const create = <T extends { id: string }>(collection: Parameters<typeof database.create>[0], value: T, setter: React.Dispatch<React.SetStateAction<T[]>>) => { void database.create(collection, value).then(saved => setter(current => [...current, saved])).catch(error => console.error(`Unable to create ${collection}:`, error)) }
  const update = <T extends { id: string }>(collection: Parameters<typeof database.update>[0], recordId: string, value: Partial<T>, setter: React.Dispatch<React.SetStateAction<T[]>>) => { void database.update(collection, recordId, value).then(saved => setter(current => current.map(item => item.id === recordId ? saved : item))).catch(error => console.error(`Unable to update ${collection}:`, error)) }
  const remove = <T extends { id: string }>(collection: Parameters<typeof database.remove>[0], recordId: string, setter: React.Dispatch<React.SetStateAction<T[]>>) => { void database.remove(collection, recordId).then(() => setter(current => current.filter(item => item.id !== recordId))).catch(error => console.error(`Unable to delete ${collection}:`, error)) }

  const addJob = useCallback((value: Omit<Job, 'id' | 'createdAt'>) => create('jobs', { ...value, id: id('JOB'), createdAt: new Date().toISOString() }, setJobs), [])
  const updateJob = useCallback((recordId: string, value: Partial<Job>) => update('jobs', recordId, value, setJobs), []); const deleteJob = useCallback((recordId: string) => remove('jobs', recordId, setJobs), [])
  const addEmployee = useCallback((value: Omit<Employee, 'id'>) => create('employees', { ...value, id: id('EMP') }, setEmployees), []); const updateEmployee = useCallback((recordId: string, value: Partial<Employee>) => update('employees', recordId, value, setEmployees), []); const deleteEmployee = useCallback((recordId: string) => remove('employees', recordId, setEmployees), [])
  const addCustomer = useCallback((value: Omit<Customer, 'id'>) => create('customers', { ...value, id: id('CUST') }, setCustomers), []); const updateCustomer = useCallback((recordId: string, value: Partial<Customer>) => update('customers', recordId, value, setCustomers), []); const deleteCustomer = useCallback((recordId: string) => remove('customers', recordId, setCustomers), [])
  const addTask = useCallback((value: Omit<Task, 'id'>) => create('tasks', { ...value, id: id('TASK') }, setTasks), []); const updateTask = useCallback((recordId: string, value: Partial<Task>) => update('tasks', recordId, value, setTasks), []); const deleteTask = useCallback((recordId: string) => remove('tasks', recordId, setTasks), []); const moveTask = useCallback((recordId: string, column: Task['column']) => update('tasks', recordId, { column }, setTasks), [])
  const markNotificationRead = useCallback((recordId: string) => update('notifications', recordId, { read: true }, setNotifications), []); const markAllRead = useCallback(() => notifications.filter(item => !item.read).forEach(item => update('notifications', item.id, { read: true }, setNotifications)), [notifications]); const deleteNotification = useCallback((recordId: string) => remove('notifications', recordId, setNotifications), [])
  const addInvoice = useCallback((value: Omit<Invoice, 'id' | 'createdAt'>) => create('invoices', { ...value, id: id('INV'), createdAt: new Date().toISOString() }, setInvoices), []); const updateInvoice = useCallback((recordId: string, value: Partial<Invoice>) => update('invoices', recordId, value, setInvoices), [])
  const addRawMaterial = useCallback((value: Omit<RawMaterial, 'id' | 'status'>) => create('rawMaterials', { ...value, id: id('RM'), status: stockStatus(value) }, setRawMaterials), []); const updateRawMaterial = useCallback((recordId: string, value: Partial<RawMaterial>) => { const current = rawMaterials.find(item => item.id === recordId); if (current) update('rawMaterials', recordId, { ...value, status: stockStatus({ ...current, ...value }) }, setRawMaterials) }, [rawMaterials])
  const addQuotation = useCallback((value: Omit<Quotation, 'id' | 'createdAt'>) => create('quotations', { ...value, id: id('QOT'), createdAt: new Date().toISOString() }, setQuotations), [])

  return <AppDataContext.Provider value={{ jobs, addJob, updateJob, deleteJob, employees, addEmployee, updateEmployee, deleteEmployee, customers, addCustomer, updateCustomer, deleteCustomer, tasks, addTask, updateTask, deleteTask, moveTask, notifications, markNotificationRead, markAllRead, deleteNotification, invoices, addInvoice, updateInvoice, rawMaterials, finishedGoods, addRawMaterial, updateRawMaterial, quotations, addQuotation, loading }}>{children}</AppDataContext.Provider>
}
export function useAppData() { const ctx = useContext(AppDataContext); if (!ctx) throw new Error('useAppData must be used inside AppDataProvider'); return ctx }
