// Mock/sample data removed to ensure no preloaded/demo data is shown to new users.
// All user data must come from the authenticated user's database collections via the API.

export type JobStatus = 'New' | 'Quoted' | 'Approved' | 'Procuring' | 'In Progress' | 'Quality Check' | 'Completed' | 'Invoiced'
export type Priority = 'High' | 'Medium' | 'Low'
export type JobMode = 'Workshop Procures' | 'Client Supplies'

export interface Job {
  id: string
  customer: string
  description: string
  priority: Priority
  assignedTo: string
  deadline: string
  status: JobStatus
  revenue: number
  createdAt?: string
  mode: JobMode
}

export interface Employee {
  id: string
  name: string
  role: string
  department: string
  email: string
  phone: string
  avatar: string
  assignedJobs: number
  completedJobs: number
  performance: number
  status: 'Active' | 'On Leave'
  joinDate: string
}

export interface Customer {
  id: string
  name: string
  company: string
  email: string
  phone: string
  city: string
  totalJobs: number
  totalRevenue: number
  status: 'Active' | 'Inactive'
  avatar: string
}

export interface Task {
  id: string
  title: string
  description: string
  assignee: string
  priority: Priority
  dueDate: string
  column: 'Pending' | 'In Progress' | 'Review' | 'Completed'
  tags: string[]
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  time: string
  read: boolean
  group: 'Today' | 'Yesterday' | 'Older'
  channel: 'whatsapp' | 'sms' | 'in-app'
}

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue'

export interface Invoice {
  id: string
  jobId: string
  customer: string
  amount: number
  status: InvoiceStatus
  dueDate: string
  createdAt?: string
}

export type StockStatus = 'OK' | 'Low Stock' | 'Out of Stock'

export interface RawMaterial {
  id: string
  name: string
  sku: string
  unit: string
  currentStock: number
  reorderLevel: number
  unitCost: number
  status: StockStatus
}

export interface FinishedGood {
  id: string
  name: string
  sku: string
  unit: string
  currentStock: number
  lastUpdated: string
}

// Export empty arrays to ensure no sample/demo data is shown in the UI.
export const jobs: Job[] = []
export const employees: Employee[] = []
export const customers: Customer[] = []
export const initialTasks: Task[] = []
export const notifications: Notification[] = []
export const invoices: Invoice[] = []
export const rawMaterials: RawMaterial[] = []
export const finishedGoods: FinishedGood[] = []

export const monthlyRevenueData: Array<{ month: string; revenue: number; jobs: number }>= []
export const jobStatusData: Array<{ name: string; value: number; color: string }> = []
export const employeePerformanceData: Array<{ name: string; performance: number; jobs: number }> = []
export const activityData: Array<{ time: string; event: string; user: string; type: string }> = []
