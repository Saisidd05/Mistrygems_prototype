// ─── Mock Data for Mistry Gems ───────────────────────────────────────────────

export type JobStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Quality Check' | 'Completed' | 'Delivered'
export type Priority = 'High' | 'Medium' | 'Low'

export interface Job {
  id: string
  customer: string
  description: string
  priority: Priority
  assignedTo: string
  deadline: string
  status: JobStatus
  revenue: number
  createdAt: string
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
}

// ─── Jobs Data ────────────────────────────────────────────────────────────────
export const jobs: Job[] = [
  { id: 'JOB-001', customer: 'Patel Enterprises', description: 'Diamond ring polishing & setting', priority: 'High', assignedTo: 'Ramesh Kumar', deadline: '2024-02-15', status: 'In Progress', revenue: 45000, createdAt: '2024-01-20' },
  { id: 'JOB-002', customer: 'Shah Jewellers', description: 'Gold necklace customization', priority: 'High', assignedTo: 'Sunita Mehta', deadline: '2024-02-10', status: 'Quality Check', revenue: 78000, createdAt: '2024-01-18' },
  { id: 'JOB-003', customer: 'Gupta & Sons', description: 'Emerald bracelet repair', priority: 'Medium', assignedTo: 'Vijay Singh', deadline: '2024-02-20', status: 'Assigned', revenue: 23000, createdAt: '2024-01-22' },
  { id: 'JOB-004', customer: 'Mehta Traders', description: 'Pearl earring set fabrication', priority: 'Low', assignedTo: 'Priya Sharma', deadline: '2024-02-25', status: 'Pending', revenue: 15000, createdAt: '2024-01-24' },
  { id: 'JOB-005', customer: 'Agarwal Gems', description: 'Ruby pendant design', priority: 'High', assignedTo: 'Ramesh Kumar', deadline: '2024-02-08', status: 'Completed', revenue: 55000, createdAt: '2024-01-15' },
  { id: 'JOB-006', customer: 'Jain Jewellers', description: 'Sapphire ring sizing', priority: 'Medium', assignedTo: 'Mohan Patel', deadline: '2024-02-18', status: 'Delivered', revenue: 12000, createdAt: '2024-01-19' },
  { id: 'JOB-007', customer: 'Kumar Industries', description: 'Platinum chain manufacturing', priority: 'High', assignedTo: 'Sunita Mehta', deadline: '2024-02-12', status: 'In Progress', revenue: 92000, createdAt: '2024-01-21' },
  { id: 'JOB-008', customer: 'Sharma Collections', description: 'Gold bangle set polishing', priority: 'Medium', assignedTo: 'Vijay Singh', deadline: '2024-02-22', status: 'Pending', revenue: 34000, createdAt: '2024-01-23' },
  { id: 'JOB-009', customer: 'Desai Exports', description: 'Diamond earring certification', priority: 'Low', assignedTo: 'Priya Sharma', deadline: '2024-02-28', status: 'Assigned', revenue: 67000, createdAt: '2024-01-25' },
  { id: 'JOB-010', customer: 'Patel Enterprises', description: 'Antique gold restoration', priority: 'Medium', assignedTo: 'Mohan Patel', deadline: '2024-03-01', status: 'Quality Check', revenue: 41000, createdAt: '2024-01-26' },
  { id: 'JOB-011', customer: 'Shah Jewellers', description: 'Silver anklet engraving', priority: 'Low', assignedTo: 'Ramesh Kumar', deadline: '2024-03-05', status: 'In Progress', revenue: 8500, createdAt: '2024-01-27' },
  { id: 'JOB-012', customer: 'Gupta & Sons', description: 'Tanzanite pendant setting', priority: 'High', assignedTo: 'Sunita Mehta', deadline: '2024-02-14', status: 'Pending', revenue: 38000, createdAt: '2024-01-28' },
]

// ─── Employees Data ───────────────────────────────────────────────────────────
export const employees: Employee[] = [
  { id: 'EMP-001', name: 'Ramesh Kumar', role: 'Senior Goldsmith', department: 'Fabrication', email: 'ramesh.kumar@mistrygems.com', phone: '+91 98765 43210', avatar: 'RK', assignedJobs: 3, completedJobs: 47, performance: 94, status: 'Active', joinDate: '2020-03-15' },
  { id: 'EMP-002', name: 'Sunita Mehta', role: 'Diamond Setter', department: 'Setting', email: 'sunita.mehta@mistrygems.com', phone: '+91 98765 43211', avatar: 'SM', assignedJobs: 2, completedJobs: 38, performance: 89, status: 'Active', joinDate: '2021-06-01' },
  { id: 'EMP-003', name: 'Vijay Singh', role: 'Quality Inspector', department: 'QC', email: 'vijay.singh@mistrygems.com', phone: '+91 98765 43212', avatar: 'VS', assignedJobs: 2, completedJobs: 31, performance: 92, status: 'Active', joinDate: '2019-11-20' },
  { id: 'EMP-004', name: 'Priya Sharma', role: 'Jewellery Designer', department: 'Design', email: 'priya.sharma@mistrygems.com', phone: '+91 98765 43213', avatar: 'PS', assignedJobs: 2, completedJobs: 29, performance: 87, status: 'Active', joinDate: '2022-01-10' },
  { id: 'EMP-005', name: 'Mohan Patel', role: 'Polishing Expert', department: 'Finishing', email: 'mohan.patel@mistrygems.com', phone: '+91 98765 43214', avatar: 'MP', assignedJobs: 2, completedJobs: 52, performance: 96, status: 'Active', joinDate: '2018-07-01' },
  { id: 'EMP-006', name: 'Anjali Gupta', role: 'Account Manager', department: 'Accounts', email: 'anjali.gupta@mistrygems.com', phone: '+91 98765 43215', avatar: 'AG', assignedJobs: 0, completedJobs: 0, performance: 88, status: 'On Leave', joinDate: '2023-02-14' },
]

// ─── Customers Data ───────────────────────────────────────────────────────────
export const customers: Customer[] = [
  { id: 'CUST-001', name: 'Arvind Patel', company: 'Patel Enterprises', email: 'arvind@patelenterprises.com', phone: '+91 98000 11111', city: 'Surat', totalJobs: 12, totalRevenue: 480000, status: 'Active', avatar: 'AP' },
  { id: 'CUST-002', name: 'Dinesh Shah', company: 'Shah Jewellers', email: 'dinesh@shahjewellers.com', phone: '+91 98000 22222', city: 'Mumbai', totalJobs: 8, totalRevenue: 320000, status: 'Active', avatar: 'DS' },
  { id: 'CUST-003', name: 'Rakesh Gupta', company: 'Gupta & Sons', email: 'rakesh@guptasons.com', phone: '+91 98000 33333', city: 'Jaipur', totalJobs: 15, totalRevenue: 560000, status: 'Active', avatar: 'RG' },
  { id: 'CUST-004', name: 'Nilesh Mehta', company: 'Mehta Traders', email: 'nilesh@mehtatraders.com', phone: '+91 98000 44444', city: 'Ahmedabad', totalJobs: 5, totalRevenue: 180000, status: 'Active', avatar: 'NM' },
  { id: 'CUST-005', name: 'Suresh Agarwal', company: 'Agarwal Gems', email: 'suresh@agarwalgems.com', phone: '+91 98000 55555', city: 'Delhi', totalJobs: 20, totalRevenue: 780000, status: 'Active', avatar: 'SA' },
  { id: 'CUST-006', name: 'Hemant Jain', company: 'Jain Jewellers', email: 'hemant@jainjewellers.com', phone: '+91 98000 66666', city: 'Kolkata', totalJobs: 3, totalRevenue: 95000, status: 'Inactive', avatar: 'HJ' },
]

// ─── Tasks Data ───────────────────────────────────────────────────────────────
export const initialTasks: Task[] = [
  { id: 'TASK-001', title: 'Polish diamond ring set', description: 'Complete the polishing for JOB-001', assignee: 'Ramesh Kumar', priority: 'High', dueDate: '2024-02-15', column: 'In Progress', tags: ['Polishing', 'Diamond'] },
  { id: 'TASK-002', title: 'Quality check necklace batch', description: 'Inspect all 12 pieces before delivery', assignee: 'Vijay Singh', priority: 'High', dueDate: '2024-02-10', column: 'Review', tags: ['QC', 'Gold'] },
  { id: 'TASK-003', title: 'Design new bracelet pattern', description: 'Create 3 design options for client', assignee: 'Priya Sharma', priority: 'Medium', dueDate: '2024-02-20', column: 'Pending', tags: ['Design', 'Creative'] },
  { id: 'TASK-004', title: 'Order ruby stones', description: 'Place order with supplier for 50 carats', assignee: 'Anjali Gupta', priority: 'High', dueDate: '2024-02-08', column: 'Completed', tags: ['Procurement'] },
  { id: 'TASK-005', title: 'Update job progress reports', description: 'Weekly report for all active jobs', assignee: 'Mohan Patel', priority: 'Low', dueDate: '2024-02-16', column: 'Pending', tags: ['Reporting'] },
  { id: 'TASK-006', title: 'Machine maintenance check', description: 'Monthly maintenance of polishing machines', assignee: 'Ramesh Kumar', priority: 'Medium', dueDate: '2024-02-18', column: 'In Progress', tags: ['Maintenance'] },
  { id: 'TASK-007', title: 'Client presentation prep', description: 'Prepare slides for Gupta & Sons meeting', assignee: 'Priya Sharma', priority: 'High', dueDate: '2024-02-12', column: 'Review', tags: ['Client', 'Meeting'] },
  { id: 'TASK-008', title: 'Inventory audit', description: 'Monthly gold & gemstone inventory count', assignee: 'Anjali Gupta', priority: 'Medium', dueDate: '2024-02-22', column: 'Completed', tags: ['Inventory'] },
]

// ─── Notifications Data ───────────────────────────────────────────────────────
export const notifications: Notification[] = [
  { id: 'N-001', title: 'Job Completed', message: 'JOB-005 (Ruby pendant design) has been marked as completed by Ramesh Kumar.', type: 'success', time: '2 hours ago', read: false, group: 'Today' },
  { id: 'N-002', title: 'Deadline Alert', message: 'JOB-002 (Gold necklace customization) is due in 2 days. Please review progress.', type: 'warning', time: '4 hours ago', read: false, group: 'Today' },
  { id: 'N-003', title: 'New Job Assigned', message: 'JOB-012 (Tanzanite pendant setting) has been assigned to Sunita Mehta.', type: 'info', time: '6 hours ago', read: true, group: 'Today' },
  { id: 'N-004', title: 'Quality Check Failed', message: 'JOB-007 (Platinum chain) failed QC inspection. Needs rework.', type: 'error', time: '8 hours ago', read: false, group: 'Today' },
  { id: 'N-005', title: 'Invoice Generated', message: 'Invoice #INV-2024-089 for Shah Jewellers has been generated for ₹78,000.', type: 'success', time: 'Yesterday, 3:00 PM', read: true, group: 'Yesterday' },
  { id: 'N-006', title: 'New Customer Onboarded', message: 'Kumar Industries has been added as a new customer.', type: 'info', time: 'Yesterday, 10:00 AM', read: true, group: 'Yesterday' },
  { id: 'N-007', title: 'Employee On Leave', message: 'Anjali Gupta has applied for leave from Feb 26 – Mar 1.', type: 'warning', time: 'Yesterday, 9:00 AM', read: false, group: 'Yesterday' },
  { id: 'N-008', title: 'Monthly Report Ready', message: 'January 2024 performance report is ready for download.', type: 'info', time: 'Jan 28, 5:00 PM', read: true, group: 'Older' },
  { id: 'N-009', title: 'System Update', message: 'Mistry Gems platform updated to v2.4.1 with new analytics features.', type: 'info', time: 'Jan 25, 11:00 AM', read: true, group: 'Older' },
]

// ─── Chart Data ───────────────────────────────────────────────────────────────
export const monthlyRevenueData = [
  { month: 'Aug', revenue: 285000, jobs: 18 },
  { month: 'Sep', revenue: 320000, jobs: 22 },
  { month: 'Oct', revenue: 295000, jobs: 20 },
  { month: 'Nov', revenue: 410000, jobs: 28 },
  { month: 'Dec', revenue: 380000, jobs: 25 },
  { month: 'Jan', revenue: 465000, jobs: 32 },
]

export const jobStatusData = [
  { name: 'Pending', value: 3, color: '#F59E0B' },
  { name: 'Assigned', value: 2, color: '#3B82F6' },
  { name: 'In Progress', value: 3, color: '#4F46E5' },
  { name: 'Quality Check', value: 2, color: '#06B6D4' },
  { name: 'Completed', value: 1, color: '#10B981' },
  { name: 'Delivered', value: 1, color: '#8B5CF6' },
]

export const employeePerformanceData = [
  { name: 'Ramesh', performance: 94, jobs: 47 },
  { name: 'Sunita', performance: 89, jobs: 38 },
  { name: 'Vijay', performance: 92, jobs: 31 },
  { name: 'Priya', performance: 87, jobs: 29 },
  { name: 'Mohan', performance: 96, jobs: 52 },
]

export const activityData = [
  { time: '09:15 AM', event: 'JOB-001 status updated to In Progress', user: 'Ramesh Kumar', type: 'job' },
  { time: '10:30 AM', event: 'New quotation created for Gupta & Sons', user: 'Admin', type: 'quotation' },
  { time: '11:45 AM', event: 'Quality check initiated for JOB-002', user: 'Vijay Singh', type: 'qc' },
  { time: '01:00 PM', event: 'JOB-005 marked as Completed', user: 'Ramesh Kumar', type: 'complete' },
  { time: '02:30 PM', event: 'Invoice #INV-2024-089 generated', user: 'Anjali Gupta', type: 'invoice' },
  { time: '04:00 PM', event: 'New job JOB-012 created', user: 'Admin', type: 'job' },
]
