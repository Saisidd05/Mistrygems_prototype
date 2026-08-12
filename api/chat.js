import jwt from 'jsonwebtoken'
import { getDatabase } from '../db/mongodb.js'

const JWT_SECRET = process.env.JWT_SECRET || 'mistry-gems-local-secret-key-12345'

function getUserFromRequest(req) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return null
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET)
    return typeof payload.id === 'string' ? payload : null
  } catch {
    return null
  }
}

export default async function handler(req, res) {
  const user = getUserFromRequest(req)
  if (!user) {
    return res.status(401).json({ error: 'A valid authentication token is required.' })
  }

  try {
    const db = await getDatabase()
    const chats = db.collection('chats')

    if (req.method === 'GET') {
      const { workshopId } = req.query || {}
      if (!workshopId) {
        return res.status(400).json({ error: 'Workshop ID parameter is required.' })
      }

      // Find all messages associated with this user and workshop
      const messages = await chats.find({
        $or: [
          { userId: user.id, workshopId: String(workshopId) },
          { senderId: user.id, workshopId: String(workshopId) },
          { senderId: String(workshopId), receiverId: user.id },
          { workshopId: String(workshopId) }
        ]
      }).sort({ createdAt: 1 }).toArray()

      return res.status(200).json(messages.map(m => ({
        id: m.id || String(m._id),
        workshopId: m.workshopId,
        senderId: m.senderId,
        senderName: m.senderName || 'User',
        text: m.text,
        createdAt: m.createdAt,
        isSelf: m.senderId === user.id
      })))
    }

    if (req.method === 'POST') {
      const { workshopId, text } = req.body || {}
      if (!workshopId || !text || !text.trim()) {
        return res.status(400).json({ error: 'Workshop ID and message text are required.' })
      }

      const newMessage = {
        id: `MSG-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        workshopId: String(workshopId),
        userId: user.id,
        senderId: user.id,
        senderName: user.name || 'Industry Customer',
        text: String(text).trim(),
        createdAt: new Date().toISOString()
      }

      await chats.insertOne(newMessage)
      return res.status(201).json({
        ...newMessage,
        isSelf: true
      })
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).json({ error: 'Method not allowed.' })
  } catch (error) {
    console.error('Chat API error:', error)
    return res.status(500).json({ error: 'Failed to process chat request.' })
  }
}
