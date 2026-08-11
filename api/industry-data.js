import jwt from 'jsonwebtoken'
import { getIndustryDatabase } from '../db/mongodb.js'

const JWT_SECRET = process.env.JWT_SECRET || 'mistry-gems-local-secret-key-12345'
const collections = new Set(['requirements', 'quotations', 'purchaseOrders', 'vendors', 'notifications'])

function userFromRequest(req) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return null
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET)
    const accountType = payload.accountType === 'industry' || String(payload.role || '').toLowerCase().includes('industry') ? 'industry' : 'workshop'
    return typeof payload.id === 'string' ? { id: payload.id, accountType, companyId: String(payload.companyId || payload.id), name: String(payload.name || '') } : null
  } catch { return null }
}

export default async function handler(req, res) {
  const collectionName = typeof req.query.collection === 'string' ? req.query.collection : ''
  if (!collections.has(collectionName)) return res.status(400).json({ error: 'A valid Industry collection is required.' })
  const user = userFromRequest(req)
  if (!user) return res.status(403).json({ error: 'Authorization is required.' })
  const feedMode = req.method === 'GET' && collectionName === 'requirements' && req.query.feed === 'workshop'
  if (user.accountType !== 'industry' && !feedMode) return res.status(403).json({ error: 'Industry authorization is required.' })
  try {
    const collection = (await getIndustryDatabase()).collection(collectionName)
    const filter = feedMode ? { status: { $ne: 'Closed' } } : { companyId: user.companyId }
    if (req.method === 'GET') return res.status(200).json(await collection.find(filter).sort({ createdAt: -1 }).toArray().then(rows => rows.map(({ _id, ownerId, companyId, ...row }) => row)))
    if (req.method === 'POST') {
      const document = req.body?.document
      if (!document || typeof document !== 'object' || Array.isArray(document)) return res.status(400).json({ error: 'A document is required.' })
      const { _id, ownerId, companyId, ...safeDocument } = document
      const saved = { companyName: user.name || safeDocument.companyName || 'Industry Account', ...safeDocument, ownerId: user.id, companyId: user.companyId, createdAt: new Date().toISOString() }
      await collection.insertOne(saved); return res.status(201).json(saved)
    }
    const id = req.method === 'DELETE' ? req.query.id : req.body?.id
    if (!id || typeof id !== 'string') return res.status(400).json({ error: 'A record id is required.' })
    if (req.method === 'PUT') {
      const { _id, id: ignoredId, ownerId, companyId, ...updates } = req.body?.updates || {}
      const result = await collection.findOneAndUpdate({ id, ...filter }, { $set: updates }, { returnDocument: 'after' })
      if (!result.value) return res.status(404).json({ error: 'Record not found.' })
      const { _id: ignored, ...record } = result.value; return res.status(200).json(record)
    }
    if (req.method === 'DELETE') { const result = await collection.deleteOne({ id, ...filter }); return result.deletedCount ? res.status(204).end() : res.status(404).json({ error: 'Record not found.' }) }
    res.setHeader('Allow', 'GET, POST, PUT, DELETE'); return res.status(405).json({ error: 'Method not allowed.' })
  } catch (error) { console.error('Industry data request failed:', error); return res.status(503).json({ error: 'Industry data service is unavailable.' }) }
}
