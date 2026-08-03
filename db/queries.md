# MongoDB query reference

Database: `mistry_gems`

Collections: `users`, `customers`, `employees`, `finishedGoods`, `invoices`, `jobs`, `notifications`, `rawMaterials`, and `tasks`.

Run these in MongoDB Atlas Data Explorer or `mongosh` after selecting the database:

```javascript
use('mistry_gems')
```

## Read

```javascript
// Read every document in a collection
db.employees.find({})

// Find one employee, job, invoice, or inventory item by its app ID
db.employees.findOne({ id: 'EMP-001' })
db.users.findOne({ email: 'owner@example.com' }) // excludes passwordHash when returned by the app API
db.jobs.findOne({ id: 'JOB-001' })
db.invoices.findOne({ id: 'INV-2024-001' })
db.rawMaterials.findOne({ id: 'RM-001' })

// Filtered queries
db.invoices.find({ status: 'Overdue' })
db.rawMaterials.find({ status: { $in: ['Low Stock', 'Out of Stock'] } })
db.tasks.find({ column: 'In Progress' })
db.jobs.find({ status: 'In Progress' })
```

## Create

```javascript
db.employees.insertOne({
  id: 'EMP-007',
  name: 'Jane Doe',
  role: 'Machine Operator',
  department: 'Production',
  email: 'jane@example.com',
  phone: '+91 90000 00000',
  avatar: 'JD',
  assignedJobs: 0,
  completedJobs: 0,
  performance: 75,
  status: 'Active',
  joinDate: '2026-08-03'
})

db.rawMaterials.insertOne({
  id: 'RM-009',
  name: 'Aluminium Sheet',
  sku: 'RM-ALSHEET-01',
  unit: 'kg',
  currentStock: 0,
  reorderLevel: 50,
  unitCost: 280,
  status: 'Low Stock'
})
```

## Update

```javascript
// Update any record by its application ID
db.employees.updateOne(
  { id: 'EMP-007' },
  { $set: { performance: 85, status: 'Active' } }
)

// Stock in / stock out
db.rawMaterials.updateOne(
  { id: 'RM-001' },
  { $inc: { currentStock: 25 } }
)

db.invoices.updateOne(
  { id: 'INV-2024-001' },
  { $set: { status: 'Paid' } }
)
```

## Delete

```javascript
db.employees.deleteOne({ id: 'EMP-007' })
db.rawMaterials.deleteOne({ id: 'RM-009' })
```

## Recommended indexes

```javascript
db.employees.createIndex({ id: 1 }, { unique: true })
db.users.createIndex({ email: 1 }, { unique: true })
db.customers.createIndex({ id: 1 }, { unique: true })
db.jobs.createIndex({ id: 1 }, { unique: true })
db.tasks.createIndex({ id: 1 }, { unique: true })
db.invoices.createIndex({ id: 1 }, { unique: true })
db.rawMaterials.createIndex({ id: 1 }, { unique: true })
db.finishedGoods.createIndex({ id: 1 }, { unique: true })
db.notifications.createIndex({ id: 1 }, { unique: true })
```
