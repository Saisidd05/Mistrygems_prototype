import jwt from 'jsonwebtoken'
import { getDatabase } from '../db/mongodb.js'

const JWT_SECRET = process.env.JWT_SECRET || 'mistry-gems-local-secret-key-12345'

const allowedCollections = new Set([
  'customers',
  'employees',
  'finishedGoods',
  'invoices',
  'jobs',
  'notifications',
  'quotations',
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

  // Owner identity must only come from a valid, signed JWT.
  let userId
  const authHeader = req.headers['authorization']
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      userId = decoded.id
    } catch {
      return res.status(401).json({ error: 'Invalid or expired authentication token.' })
    }
  }

  if (!userId || typeof userId !== 'string') {
    return res.status(401).json({ error: 'A valid authentication token is required.' })
  }

  try {
    const database = await getDatabase()
    const collection = database.collection(collectionName)

    if (req.method === 'GET') {
      // Return only documents owned by the authenticated user.
      const documents = await collection.find({ ownerId: String(userId) }).sort({ createdAt: -1 }).toArray()
      return res.status(200).json(documents.map(withoutMongoId))
    }

    if (req.method === 'POST') {
      const document = req.body?.document
      if (!document || typeof document !== 'object' || Array.isArray(document)) {
        return res.status(400).json({ error: 'A document object is required.' })
      }

      const { _id, ...safeDocument } = document
      // Enforce ownership so shared/sample documents are not created.
      safeDocument.ownerId = String(userId)
      safeDocument.createdAt = new Date().toISOString()
      await collection.insertOne(safeDocument)
      return res.status(201).json(safeDocument)
    }

    if (req.method === 'PUT') {
      const { id, updates } = req.body || {}
      if (!id || !updates || typeof updates !== 'object' || Array.isArray(updates)) {
        return res.status(400).json({ error: 'An id and updates object are required.' })
      }

      const { _id, id: ignoredId, ownerId: ignoredOwnerId, ...safeUpdates } = updates
      // Only allow updates for documents belonging to this user
      const existing = await collection.findOne({ id })
      if (!existing) return res.status(404).json({ error: 'Document not found.' })
      if (existing.ownerId !== String(userId)) return res.status(403).json({ error: 'You do not have permission to modify this record.' })
      const result = await collection.findOneAndUpdate(
        { id, ownerId: String(userId) },
        { $set: safeUpdates },
        { returnDocument: 'after' },
      )
      if (!result.value) return res.status(404).json({ error: 'Document not found.' })
      return res.status(200).json(withoutMongoId(result.value))
    }

    if (req.method === 'DELETE') {
      const id = typeof req.query.id === 'string' ? req.query.id : ''
      if (!id) return res.status(400).json({ error: 'An id query parameter is required.' })
      const existing = await collection.findOne({ id })
      if (!existing) return res.status(404).json({ error: 'Document not found.' })
      if (existing.ownerId !== String(userId)) return res.status(403).json({ error: 'You do not have permission to delete this record.' })
      const result = await collection.deleteOne({ id, ownerId: String(userId) })
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
