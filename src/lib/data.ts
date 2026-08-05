// ─── Mistry Gems — All App Data (Seed) ────────────────────────────────────────

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
  createdAt: string
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
  createdAt: string
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

export interface UserAccount {
  username: string
  password: string
  role: 'Owner' | 'Manager' | 'Employee' | 'Client'
  name: string
  avatar: string
  email: string
}

// ─── Users ────────────────────────────────────────────────────────────────────
export const seedUsers: UserAccount[] = [
  { username: 'admin', password: 'mistry123', role: 'Owner', name: 'Vikram Mistry', avatar: 'VM', email: 'vikram@mistrygems.com' },
  { username: 'manager', password: 'pass123', role: 'Manager', name: 'Rahul Kapoor', avatar: 'RK', email: 'rahul@mistrygems.com' },
  { username: 'ramesh', password: 'pass123', role: 'Employee', name: 'Ramesh Sharma', avatar: 'RS', email: 'ramesh@mistrygems.com' },
]

// ─── Jobs ─────────────────────────────────────────────────────────────────────
export const seedJobs: Job[] = [
  { id: 'JOB-001', customer: 'Shree Auto Parts', description: 'CNC turning of 50 flanges — MS grade', priority: 'High', assignedTo: 'Ravi Sharma', deadline: '2024-03-15', status: 'In Progress', revenue: 85000, createdAt: '2024-01-20', mode: 'Workshop Procures' },
  { id: 'JOB-002', customer: 'Bharat Fabricators', description: 'Sheet metal bending batch — 200 units', priority: 'High', assignedTo: 'Deepak Yadav', deadline: '2024-03-10', status: 'Quality Check', revenue: 120000, createdAt: '2024-01-18', mode: 'Client Supplies' },
  { id: 'JOB-003', customer: 'Precision Engineers Pvt Ltd', description: 'Surface grinding of 80 bearing housings', priority: 'Medium', assignedTo: 'Sunil Verma', deadline: '2024-03-20', status: 'Approved', revenue: 45000, createdAt: '2024-01-22', mode: 'Client Supplies' },
  { id: 'JOB-004', customer: 'Kumar Machine Works', description: 'Welding MS frame assembly — 10 units', priority: 'Low', assignedTo: 'Manoj Tiwari', deadline: '2024-03-25', status: 'New', revenue: 32000, createdAt: '2024-01-24', mode: 'Workshop Procures' },
  { id: 'JOB-005', customer: 'Anand Sheet Metal Co.', description: 'Powder coating of 300 brackets', priority: 'High', assignedTo: 'Ravi Sharma', deadline: '2024-02-08', status: 'Completed', revenue: 55000, createdAt: '2024-01-15', mode: 'Client Supplies' },
  { id: 'JOB-006', customer: 'Rajesh Industrial Supplies', description: 'Lathe turning of 100 shafts — EN8 steel', priority: 'Medium', assignedTo: 'Amit Patel', deadline: '2024-03-18', status: 'Invoiced', revenue: 195000, createdAt: '2024-01-19', mode: 'Workshop Procures' },
  { id: 'JOB-007', customer: 'Shree Auto Parts', description: 'Drilling and tapping of engine blocks — batch of 25', priority: 'High', assignedTo: 'Deepak Yadav', deadline: '2024-03-12', status: 'In Progress', revenue: 78000, createdAt: '2024-01-21', mode: 'Client Supplies' },
  { id: 'JOB-008', customer: 'Bharat Fabricators', description: 'Casting of aluminium pulleys — 150 pcs', priority: 'Medium', assignedTo: 'Sunil Verma', deadline: '2024-03-22', status: 'Procuring', revenue: 110000, createdAt: '2024-01-23', mode: 'Workshop Procures' },
  { id: 'JOB-009', customer: 'Precision Engineers Pvt Ltd', description: 'CNC machining of hydraulic valve bodies', priority: 'Low', assignedTo: 'Manoj Tiwari', deadline: '2024-03-28', status: 'Quoted', revenue: 67000, createdAt: '2024-01-25', mode: 'Workshop Procures' },
  { id: 'JOB-010', customer: 'Kumar Machine Works', description: 'Welding and fabrication of conveyor frame', priority: 'Medium', assignedTo: 'Amit Patel', deadline: '2024-04-01', status: 'Quality Check', revenue: 145000, createdAt: '2024-01-26', mode: 'Client Supplies' },
]

// ─── Employees ────────────────────────────────────────────────────────────────
export const seedEmployees: Employee[] = [
  { id: 'EMP-001', name: 'Ravi Sharma', role: 'Machine Operator', department: 'CNC', email: 'ravi.sharma@mistrygems.com', phone: '+91 98765 43210', avatar: 'RS', assignedJobs: 3, completedJobs: 47, performance: 94, status: 'Active', joinDate: '2020-03-15' },
  { id: 'EMP-002', name: 'Deepak Yadav', role: 'Fabrication Lead', department: 'Fabrication', email: 'deepak.yadav@mistrygems.com', phone: '+91 98765 43211', avatar: 'DY', assignedJobs: 3, completedJobs: 38, performance: 89, status: 'Active', joinDate: '2021-06-01' },
  { id: 'EMP-003', name: 'Sunil Verma', role: 'Quality Inspector', department: 'QC', email: 'sunil.verma@mistrygems.com', phone: '+91 98765 43212', avatar: 'SV', assignedJobs: 2, completedJobs: 31, performance: 92, status: 'Active', joinDate: '2019-11-20' },
  { id: 'EMP-004', name: 'Manoj Tiwari', role: 'Welding Specialist', department: 'Welding', email: 'manoj.tiwari@mistrygems.com', phone: '+91 98765 43213', avatar: 'MT', assignedJobs: 2, completedJobs: 29, performance: 87, status: 'Active', joinDate: '2022-01-10' },
  { id: 'EMP-005', name: 'Amit Patel', role: 'Lathe Operator', department: 'Lathe', email: 'amit.patel@mistrygems.com', phone: '+91 98765 43214', avatar: 'AP', assignedJobs: 2, completedJobs: 52, performance: 96, status: 'Active', joinDate: '2018-07-01' },
  { id: 'EMP-006', name: 'Vikram Singh', role: 'Production Manager', department: 'Production', email: 'vikram.singh@mistrygems.com', phone: '+91 98765 43215', avatar: 'VS', assignedJobs: 0, completedJobs: 0, performance: 91, status: 'On Leave', joinDate: '2023-02-14' },
]

// ─── Customers ────────────────────────────────────────────────────────────────
export const seedCustomers: Customer[] = [
  { id: 'CUST-001', name: 'Ramesh Agarwal', company: 'Shree Auto Parts', email: 'ramesh@shreeautoparts.com', phone: '+91 98000 11111', city: 'Rajkot', totalJobs: 12, totalRevenue: 480000, status: 'Active', avatar: 'RA' },
  { id: 'CUST-002', name: 'Dinesh Mehta', company: 'Bharat Fabricators', email: 'dinesh@bharatfab.com', phone: '+91 98000 22222', city: 'Ahmedabad', totalJobs: 8, totalRevenue: 320000, status: 'Active', avatar: 'DM' },
  { id: 'CUST-003', name: 'Rakesh Gupta', company: 'Precision Engineers Pvt Ltd', email: 'rakesh@precisioneng.com', phone: '+91 98000 33333', city: 'Pune', totalJobs: 15, totalRevenue: 560000, status: 'Active', avatar: 'RG' },
  { id: 'CUST-004', name: 'Nilesh Kumar', company: 'Kumar Machine Works', email: 'nilesh@kumarmachine.com', phone: '+91 98000 44444', city: 'Ludhiana', totalJobs: 5, totalRevenue: 180000, status: 'Active', avatar: 'NK' },
  { id: 'CUST-005', name: 'Suresh Anand', company: 'Anand Sheet Metal Co.', email: 'suresh@anandsheetmetal.com', phone: '+91 98000 55555', city: 'Coimbatore', totalJobs: 20, totalRevenue: 780000, status: 'Active', avatar: 'SA' },
  { id: 'CUST-006', name: 'Rajesh Joshi', company: 'Rajesh Industrial Supplies', email: 'rajesh@rajeshind.com', phone: '+91 98000 66666', city: 'Jaipur', totalJobs: 3, totalRevenue: 95000, status: 'Inactive', avatar: 'RJ' },
]

// ─── Tasks ────────────────────────────────────────────────────────────────────
export const seedTasks: Task[] = [
  { id: 'TASK-001', title: 'Set up CNC program for flanges', description: 'Program G-code and set tooling for JOB-001 flange batch', assignee: 'Ravi Sharma', priority: 'High', dueDate: '2024-03-15', column: 'In Progress', tags: ['CNC', 'Setup'] },
  { id: 'TASK-002', title: 'QC inspection — sheet metal batch', description: 'Inspect all 200 bent units for dimensional accuracy', assignee: 'Sunil Verma', priority: 'High', dueDate: '2024-03-10', column: 'Review', tags: ['QC', 'Sheet Metal'] },
  { id: 'TASK-003', title: 'Prepare welding jig for MS frames', description: 'Design and fabricate welding jig for frame assembly', assignee: 'Manoj Tiwari', priority: 'Medium', dueDate: '2024-03-20', column: 'Pending', tags: ['Welding', 'Jig'] },
  { id: 'TASK-004', title: 'Order raw material — EN8 steel rods', description: 'Place order with supplier for 500kg EN8 round bars', assignee: 'Vikram Singh', priority: 'High', dueDate: '2024-03-08', column: 'Completed', tags: ['Procurement'] },
  { id: 'TASK-005', title: 'Update job progress reports', description: 'Weekly report for all active manufacturing jobs', assignee: 'Amit Patel', priority: 'Low', dueDate: '2024-03-16', column: 'Pending', tags: ['Reporting'] },
  { id: 'TASK-006', title: 'CNC machine maintenance check', description: 'Monthly maintenance of CNC lathe and milling machines', assignee: 'Ravi Sharma', priority: 'Medium', dueDate: '2024-03-18', column: 'In Progress', tags: ['Maintenance'] },
  { id: 'TASK-007', title: 'Client meeting prep — Precision Engineers', description: 'Prepare cost estimates and timeline for hydraulic valve job', assignee: 'Vikram Singh', priority: 'High', dueDate: '2024-03-12', column: 'Review', tags: ['Client', 'Meeting'] },
  { id: 'TASK-008', title: 'Inventory audit — raw materials', description: 'Monthly stock count of steel, aluminium, and consumables', assignee: 'Deepak Yadav', priority: 'Medium', dueDate: '2024-03-22', column: 'Completed', tags: ['Inventory'] },
]

// ─── Notifications ────────────────────────────────────────────────────────────
export const seedNotifications: Notification[] = [
  { id: 'N-001', title: 'Job Completed', message: 'JOB-005 (Powder coating of 300 brackets) has been marked as completed by Ravi Sharma.', type: 'success', time: '2 hours ago', read: false, group: 'Today', channel: 'in-app' },
  { id: 'N-002', title: 'Deadline Alert', message: 'JOB-002 (Sheet metal bending batch) is due in 2 days. Please review progress.', type: 'warning', time: '4 hours ago', read: false, group: 'Today', channel: 'whatsapp' },
  { id: 'N-003', title: 'New Job Assigned', message: 'JOB-012 (Surface grinding of die plates) has been assigned to Deepak Yadav.', type: 'info', time: '6 hours ago', read: true, group: 'Today', channel: 'sms' },
  { id: 'N-004', title: 'Quality Check Failed', message: 'JOB-007 failed QC inspection. Needs rework on 3 units.', type: 'error', time: '8 hours ago', read: false, group: 'Today', channel: 'in-app' },
  { id: 'N-005', title: 'Invoice Generated', message: 'Invoice #INV-2024-003 for Rajesh Industrial Supplies has been generated for ₹1,95,000.', type: 'success', time: 'Yesterday, 3:00 PM', read: true, group: 'Yesterday', channel: 'whatsapp' },
  { id: 'N-006', title: 'Raw Material Received', message: 'EN8 steel rods (500kg) received from supplier. Stock updated in inventory.', type: 'info', time: 'Yesterday, 10:00 AM', read: true, group: 'Yesterday', channel: 'in-app' },
]

// ─── Invoices ─────────────────────────────────────────────────────────────────
export const seedInvoices: Invoice[] = [
  { id: 'INV-2024-001', jobId: 'JOB-005', customer: 'Anand Sheet Metal Co.', amount: 55000, status: 'Paid', dueDate: '2024-02-20', createdAt: '2024-02-08' },
  { id: 'INV-2024-002', jobId: 'JOB-006', customer: 'Rajesh Industrial Supplies', amount: 195000, status: 'Sent', dueDate: '2024-03-28', createdAt: '2024-02-18' },
  { id: 'INV-2024-003', jobId: 'JOB-001', customer: 'Shree Auto Parts', amount: 85000, status: 'Draft', dueDate: '2024-04-01', createdAt: '2024-02-15' },
  { id: 'INV-2024-004', jobId: 'JOB-002', customer: 'Bharat Fabricators', amount: 120000, status: 'Overdue', dueDate: '2024-02-10', createdAt: '2024-02-05' },
  { id: 'INV-2024-005', jobId: 'JOB-003', customer: 'Precision Engineers Pvt Ltd', amount: 45000, status: 'Draft', dueDate: '2024-04-05', createdAt: '2024-02-20' },
  { id: 'INV-2024-006', jobId: 'JOB-007', customer: 'Shree Auto Parts', amount: 78000, status: 'Sent', dueDate: '2024-03-25', createdAt: '2024-02-12' },
  { id: 'INV-2024-007', jobId: 'JOB-010', customer: 'Kumar Machine Works', amount: 145000, status: 'Paid', dueDate: '2024-04-10', createdAt: '2024-03-01' },
]

// ─── Raw Materials ────────────────────────────────────────────────────────────
export const rawMaterials: RawMaterial[] = [
  { id: 'RM-001', name: 'MS Flat Bar (50x10mm)', sku: 'RM-MSFLAT-5010', unit: 'kg', currentStock: 250, reorderLevel: 100, unitCost: 65, status: 'OK' },
  { id: 'RM-002', name: 'Aluminium Rod (25mm dia)', sku: 'RM-ALROD-25', unit: 'kg', currentStock: 45, reorderLevel: 50, unitCost: 280, status: 'Low Stock' },
  { id: 'RM-003', name: 'EN8 Steel Round Bar', sku: 'RM-EN8RB-40', unit: 'kg', currentStock: 500, reorderLevel: 200, unitCost: 85, status: 'OK' },
  { id: 'RM-004', name: 'Steel Pipes (1.5" SCH40)', sku: 'RM-STPIPE-15', unit: 'meters', currentStock: 120, reorderLevel: 50, unitCost: 180, status: 'OK' },
  { id: 'RM-005', name: 'Drill Bits (HSS Assorted)', sku: 'RM-DRBIT-HSS', unit: 'pcs', currentStock: 8, reorderLevel: 20, unitCost: 350, status: 'Low Stock' },
  { id: 'RM-006', name: 'Cutting Discs (4.5")', sku: 'RM-CUTDISC-45', unit: 'pcs', currentStock: 0, reorderLevel: 30, unitCost: 45, status: 'Out of Stock' },
  { id: 'RM-007', name: 'Welding Wire (MIG 0.8mm)', sku: 'RM-WELDWIRE-08', unit: 'kg', currentStock: 25, reorderLevel: 15, unitCost: 220, status: 'OK' },
  { id: 'RM-008', name: 'Powder Coat Paint (RAL 9005)', sku: 'RM-PCPAINT-9005', unit: 'kg', currentStock: 12, reorderLevel: 10, unitCost: 450, status: 'OK' },
]

export const finishedGoods: FinishedGood[] = [
  { id: 'FG-001', name: 'CNC Flanges (MS)', sku: 'FG-FLANGE-MS50', unit: 'pcs', currentStock: 35, lastUpdated: '2024-02-14' },
  { id: 'FG-002', name: 'Bearing Housings (Ground)', sku: 'FG-BRHSG-GRD', unit: 'pcs', currentStock: 42, lastUpdated: '2024-02-12' },
  { id: 'FG-003', name: 'Turned Shafts (EN8)', sku: 'FG-SHAFT-EN8', unit: 'pcs', currentStock: 18, lastUpdated: '2024-02-10' },
  { id: 'FG-004', name: 'Powder Coated Brackets', sku: 'FG-BRKT-PC', unit: 'pcs', currentStock: 290, lastUpdated: '2024-02-08' },
  { id: 'FG-005', name: 'Welded Frames (MS)', sku: 'FG-FRAME-MS', unit: 'pcs', currentStock: 6, lastUpdated: '2024-02-06' },
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
  { name: 'New', value: 2, color: '#94A3B8' },
  { name: 'In Progress', value: 3, color: '#00B4D8' },
  { name: 'Quality Check', value: 2, color: '#0077B6' },
  { name: 'Completed', value: 1, color: '#10B981' },
  { name: 'Invoiced', value: 1, color: '#8B5CF6' },
  { name: 'Procuring', value: 1, color: '#F59E0B' },
]

export const employeePerformanceData = [
  { name: 'Ravi', performance: 94, jobs: 47 },
  { name: 'Deepak', performance: 89, jobs: 38 },
  { name: 'Sunil', performance: 92, jobs: 31 },
  { name: 'Manoj', performance: 87, jobs: 29 },
  { name: 'Amit', performance: 96, jobs: 52 },
]
