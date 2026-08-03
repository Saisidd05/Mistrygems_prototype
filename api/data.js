import { getDatabase } from '../db/mongodb.js'

const allowedCollections = new Set([
  'customers',
  'employees',
  'finishedGoods',
  'invoices',
  'jobs',
  'notifications',
  'rawMaterials',
  'tasks',
])

function withoutMongoId(document) {
  const { _id, ...data } = document
  return data
}

function getCollectionName(req) {
  const value = Array.isArray(req.query.collection) ? req.query.collection[0] : req.query.collection
  return typeof value === 'string' && allowedCollections.has(value) ? value : null
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, POST, PUT, DELETE, OPTIONS')
    return res.status(204).end()
  }

  const collectionName = getCollectionName(req)
  if (!collectionName) {
    return res.status(400).json({ error: 'A valid collection query parameter is required.' })
  }

  try {
    const database = await getDatabase()
    const collection = database.collection(collectionName)

    if (req.method === 'GET') {
      const documents = await collection.find({}).sort({ createdAt: -1 }).toArray()
      return res.status(200).json(documents.map(withoutMongoId))
    }

    if (req.method === 'POST') {
      const document = req.body?.document
      if (!document || typeof document !== 'object' || Array.isArray(document)) {
        return res.status(400).json({ error: 'A document object is required.' })
      }

      const { _id, ...safeDocument } = document
      await collection.insertOne(safeDocument)
      return res.status(201).json(safeDocument)
    }

    if (req.method === 'PUT') {
      const { id, updates } = req.body || {}
      if (!id || !updates || typeof updates !== 'object' || Array.isArray(updates)) {
        return res.status(400).json({ error: 'An id and updates object are required.' })
      }

      const { _id, id: ignoredId, ...safeUpdates } = updates
      const result = await collection.findOneAndUpdate(
        { id },
        { $set: safeUpdates },
        { returnDocument: 'after' },
      )
      if (!result) return res.status(404).json({ error: 'Document not found.' })
      return res.status(200).json(withoutMongoId(result))
    }

    if (req.method === 'DELETE') {
      const id = typeof req.query.id === 'string' ? req.query.id : ''
      if (!id) return res.status(400).json({ error: 'An id query parameter is required.' })
      const result = await collection.deleteOne({ id })
      if (!result.deletedCount) return res.status(404).json({ error: 'Document not found.' })
      return res.status(204).end()
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE, OPTIONS')
    return res.status(405).json({ error: 'Method not allowed.' })
  } catch (error) {
    console.error('Database request failed:', error)
    return res.status(503).json({ error: 'Database service is unavailable.' })
  }
}
