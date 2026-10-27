export type JobStatus = 'New' | 'Quoted' | 'Approved' | 'Procuring' | 'In Progress' | 'Quality Check' | 'Completed' | 'Invoiced'
export type Priority = 'High' | 'Medium' | 'Low'
export type JobMode = 'Workshop Procures' | 'Client Supplies'

export interface Job { id: string; customer: string; description: string; priority: Priority; deadline: string; status: JobStatus; revenue: number; createdAt: string; mode: JobMode }
export interface Customer { id: string; name: string; company: string; email: string; phone: string; city: string; totalJobs: number; totalRevenue: number; status: 'Active' | 'Inactive'; avatar: string }
export interface Notification { id: string; title: string; message: string; type: 'info' | 'success' | 'warning' | 'error'; time: string; read: boolean; group: 'Today' | 'Yesterday' | 'Older'; channel: 'whatsapp' | 'sms' | 'in-app' }
export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue'
export interface Invoice { id: string; jobId: string; customer: string; amount: number; status: InvoiceStatus; dueDate: string; createdAt: string }
export type StockStatus = 'OK' | 'Low Stock' | 'Out of Stock'
export interface RawMaterial { id: string; name: string; sku: string; unit: string; currentStock: number; reorderLevel: number; unitCost: number; status: StockStatus }
export interface FinishedGood { id: string; name: string; sku: string; unit: string; currentStock: number; lastUpdated: string }
export interface Quotation { id: string; customer: string; description: string; quantity: number; unitCost: number; gstRate: number; amount: number; status: 'Draft' | 'Sent'; createdAt: string }
