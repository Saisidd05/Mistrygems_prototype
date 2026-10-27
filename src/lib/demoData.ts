import type { Customer, FinishedGood, Invoice, Job, Notification, Quotation, RawMaterial } from './data'

const now = () => new Date().toISOString()

/** Demo records are created only for a newly empty workspace. */
export function workshopDemoData() {
  const createdAt = now()
  const customers: Customer[] = [
    { id: 'DEMO-CUST-ARUL', name: 'Arul Kumar', company: 'Arul Auto Components', email: 'arul@example.com', phone: '98765 43210', city: 'Chennai', totalJobs: 4, totalRevenue: 185000, status: 'Active', avatar: 'AK' },
    { id: 'DEMO-CUST-KAVITHA', name: 'Kavitha Ramesh', company: 'Kavitha Engineering Works', email: 'kavitha@example.com', phone: '97890 12345', city: 'Coimbatore', totalJobs: 3, totalRevenue: 128000, status: 'Active', avatar: 'KR' },
    { id: 'DEMO-CUST-SENTHIL', name: 'Senthil Nathan', company: 'Senthil Fabrications', email: 'senthil@example.com', phone: '98401 56789', city: 'Chennai', totalJobs: 2, totalRevenue: 76000, status: 'Active', avatar: 'SN' },
  ]
  const jobs: Job[] = [
    { id: 'DEMO-JOB-001', customer: 'Arul Kumar', description: 'CNC machining for motor housing', priority: 'High', deadline: '2026-11-08', status: 'In Progress', revenue: 85000, createdAt, mode: 'Workshop Procures' },
    { id: 'DEMO-JOB-002', customer: 'Kavitha Ramesh', description: 'Sheet metal enclosure fabrication', priority: 'Medium', deadline: '2026-11-15', status: 'Quoted', revenue: 62000, createdAt, mode: 'Client Supplies' },
    { id: 'DEMO-JOB-003', customer: 'Senthil Nathan', description: 'Precision shaft turning', priority: 'Low', deadline: '2026-11-21', status: 'Approved', revenue: 38000, createdAt, mode: 'Workshop Procures' },
  ]
  const invoices: Invoice[] = [
    { id: 'DEMO-INV-001', jobId: 'DEMO-JOB-001', customer: 'Arul Kumar', amount: 85000, status: 'Sent', dueDate: '2026-11-15', createdAt },
    { id: 'DEMO-INV-002', jobId: 'DEMO-JOB-003', customer: 'Senthil Nathan', amount: 38000, status: 'Paid', dueDate: '2026-10-30', createdAt },
  ]
  const quotations: Quotation[] = [
    { id: 'DEMO-QOT-001', customer: 'Kavitha Ramesh', description: 'Sheet metal enclosure fabrication', quantity: 100, unitCost: 620, gstRate: 18, amount: 73160, status: 'Sent', createdAt },
  ]
  const rawMaterials: RawMaterial[] = [
    { id: 'DEMO-RM-001', name: 'Mild Steel Sheet', sku: 'MS-SHT-01', unit: 'kg', currentStock: 120, reorderLevel: 40, unitCost: 68, status: 'OK' },
    { id: 'DEMO-RM-002', name: 'EN8 Steel Rod', sku: 'EN8-RD-01', unit: 'kg', currentStock: 18, reorderLevel: 25, unitCost: 96, status: 'Low Stock' },
  ]
  const finishedGoods: FinishedGood[] = [
    { id: 'DEMO-FG-001', name: 'Motor Housing', sku: 'FG-MH-001', unit: 'pcs', currentStock: 24, lastUpdated: createdAt },
  ]
  const notifications: Notification[] = [
    { id: 'DEMO-NOT-001', title: 'New job assigned', message: 'Arul Kumar’s motor housing job is ready for production.', type: 'info', time: '10 min ago', read: false, group: 'Today', channel: 'in-app' },
    { id: 'DEMO-NOT-002', title: 'Material stock alert', message: 'EN8 Steel Rod stock is below the reorder level.', type: 'warning', time: '1 hr ago', read: false, group: 'Today', channel: 'in-app' },
  ]
  return { customers, jobs, invoices, quotations, rawMaterials, finishedGoods, notifications }
}

export const industryDemoRequirements = [
  { id: 'DEMO-REQ-001', jobTitle: 'Pump Housing CNC Machining', description: 'Machine cast pump housings as per approved drawing.', category: 'CNC Machining', materialSpecification: 'Cast Iron FG260', manufacturingProcess: 'CNC milling and drilling', quantity: 80, unit: 'Pieces', certifications: 'ISO 9001', deliveryDate: '2026-11-20', deliveryLocation: 'Chennai', budget: 180000, notes: 'Contact: Meenakshi Sundaram', status: 'Open' as const, quotationsReceived: 2, assignedWorkshop: 'Murugan Precision Works' },
  { id: 'DEMO-REQ-002', jobTitle: 'Control Panel Enclosure', description: 'Fabricate and powder coat electrical control panel enclosures.', category: 'Sheet Metal', materialSpecification: 'CRCA 1.6 mm', manufacturingProcess: 'Laser cutting, bending and powder coating', quantity: 50, unit: 'Pieces', certifications: 'ISO 9001', deliveryDate: '2026-11-28', deliveryLocation: 'Coimbatore', budget: 145000, notes: 'Contact: Priya Natarajan', status: 'In Production' as const, quotationsReceived: 3, assignedWorkshop: 'Thirumalai Fabricators' },
]
