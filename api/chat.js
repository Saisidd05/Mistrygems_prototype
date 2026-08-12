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

function isWorkshop(user) {
  return (
    user.accountType === 'workshop' ||
    (!user.accountType && !String(user.role || '').toLowerCase().includes('industry'))
  )
}

export default async function handler(req, res) {
  const user = getUserFromRequest(req)
  if (!user) {
    return res.status(401).json({ error: 'A valid authentication token is required.' })
  }

  try {
    const db = await getDatabase()
    const chats = db.collection('chats')
    const workshopUser = isWorkshop(user)

    // ── GET ─────────────────────────────────────────────────────────────────
    if (req.method === 'GET') {
      const { workshopId, customerId, threads } = req.query || {}

      // Workshop: list all unique conversation threads (one per industry customer)
      if (workshopUser && threads === '1') {
        // All messages where this workshop is the target
        const allMessages = await chats
          .find({ workshopId: user.id })
          .sort({ createdAt: -1 })
          .toArray()

        // Group by sender (industry customer userId)
        const threadMap = {}
        for (const msg of allMessages) {
          // The industry customer userId — use userId field (set on POST)
          const cid = msg.senderId === user.id ? msg.receiverId : msg.senderId
          if (!cid) continue
          if (!threadMap[cid]) {
            threadMap[cid] = {
              customerId: cid,
              customerName: msg.senderId === user.id ? (msg.receiverName || cid) : (msg.senderName || cid),
              lastMessage: msg.text,
              lastAt: msg.createdAt,
              unread: 0,
            }
          }
          if (!msg.readByWorkshop && msg.senderId !== user.id) {
            threadMap[cid].unread += 1
          }
        }

        return res.status(200).json(Object.values(threadMap))
      }

      // Industry: list every workshop conversation for the signed-in industry user.
      // This lets the industry chat screen show replies from all workshop owners,
      // rather than only showing a preview after each workshop is opened.
      if (!workshopUser && threads === '1') {
        const allMessages = await chats
          .find({
            $or: [
              { userId: user.id },
              { senderId: user.id },
              { receiverId: user.id },
            ],
          })
          .sort({ createdAt: -1 })
          .toArray()

        const threadMap = {}
        for (const msg of allMessages) {
          const wid = msg.workshopId
          if (!wid) continue
          if (!threadMap[wid]) {
            const isWorkshopMessage = msg.senderId === wid
            threadMap[wid] = {
              workshopId: wid,
              workshopName: isWorkshopMessage
                ? (msg.senderName || wid)
                : (msg.receiverName || wid),
              lastMessage: msg.text,
              lastAt: msg.createdAt,
              unread: 0,
            }
          }
          if (msg.senderId === wid && !msg.readByIndustry) {
            threadMap[wid].unread += 1
          }
        }

        return res.status(200).json(Object.values(threadMap))
      }

      // Workshop: messages with a specific industry customer
      if (workshopUser && customerId) {
        const messages = await chats
          .find({
            workshopId: user.id,
            $or: [
              { senderId: String(customerId) },
              { senderId: user.id, receiverId: String(customerId) },
            ],
          })
          .sort({ createdAt: 1 })
          .toArray()

        // Mark messages as read by workshop
        await chats.updateMany(
          { workshopId: user.id, senderId: String(customerId), readByWorkshop: { $ne: true } },
          { $set: { readByWorkshop: true } }
        )

        return res.status(200).json(
          messages.map(m => ({
            id: m.id || String(m._id),
            workshopId: m.workshopId,
            senderId: m.senderId,
            senderName: m.senderName || 'Customer',
            text: m.text,
            createdAt: m.createdAt,
            isSelf: m.senderId === user.id,
          }))
        )
      }

      // Industry customer: messages with a specific workshop
      if (!workshopUser) {
        if (!workshopId) {
          return res.status(400).json({ error: 'workshopId parameter is required.' })
        }

        const messages = await chats
          .find({
            workshopId: String(workshopId),
            $or: [
              { senderId: user.id },
              { senderId: String(workshopId), receiverId: user.id },
            ],
          })
          .sort({ createdAt: 1 })
          .toArray()

        await chats.updateMany(
          { workshopId: String(workshopId), senderId: String(workshopId), receiverId: user.id, readByIndustry: { $ne: true } },
          { $set: { readByIndustry: true } }
        )

        return res.status(200).json(
          messages.map(m => ({
            id: m.id || String(m._id),
            workshopId: m.workshopId,
            senderId: m.senderId,
            senderName: m.senderName || 'User',
            text: m.text,
            createdAt: m.createdAt,
            isSelf: m.senderId === user.id,
          }))
        )
      }

      return res.status(400).json({ error: 'Missing query parameters.' })
    }

    // ── POST ────────────────────────────────────────────────────────────────
    if (req.method === 'POST') {
      const { workshopId, workshopName, text, receiverId, receiverName } = req.body || {}

      if (!text || !text.trim()) {
        return res.status(400).json({ error: 'Message text is required.' })
      }

      // Workshop replying to industry customer
      if (workshopUser) {
        if (!receiverId) {
          return res.status(400).json({ error: 'receiverId is required for workshop replies.' })
        }
        const newMessage = {
          id: `MSG-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
          workshopId: user.id,
          senderId: user.id,
          senderName: user.workshopName || user.name || 'Workshop',
          receiverId: String(receiverId),
          receiverName: receiverName || 'Customer',
          text: String(text).trim(),
          createdAt: new Date().toISOString(),
          readByWorkshop: true,
          readByIndustry: false,
        }
        await chats.insertOne(newMessage)
        return res.status(201).json({ ...newMessage, isSelf: true })
      }

      // Industry customer sending to workshop
      if (!workshopId) {
        return res.status(400).json({ error: 'workshopId is required.' })
      }
      const newMessage = {
        id: `MSG-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        workshopId: String(workshopId),
        userId: user.id,
        senderId: user.id,
        senderName: user.name || 'Industry Customer',
        receiverName: workshopName || '',
        text: String(text).trim(),
        createdAt: new Date().toISOString(),
        readByWorkshop: false,
        readByIndustry: true,
      }
      await chats.insertOne(newMessage)
      return res.status(201).json({ ...newMessage, isSelf: true })
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).json({ error: 'Method not allowed.' })
  } catch (error) {
    console.error('Chat API error:', error)
    return res.status(500).json({ error: 'Failed to process chat request.' })
  }
}
