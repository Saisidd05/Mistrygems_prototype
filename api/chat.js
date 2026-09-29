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
    const presence = db.collection('chat_presence')
    const workshopUser = isWorkshop(user)
    const now = Date.now()

    // Keep active user presence alive
    await presence.updateOne(
      { userId: user.id },
      { $set: { userId: user.id, lastSeen: new Date() } },
      { upsert: true }
    )

    // ── GET ─────────────────────────────────────────────────────────────────
    if (req.method === 'GET') {
      const { workshopId, customerId, threads } = req.query || {}

      // Workshop: list all unique conversation threads
      if (workshopUser && threads === '1') {
        const allMessages = await chats
          .find({ workshopId: user.id })
          .sort({ createdAt: -1 })
          .toArray()

        const threadMap = {}
        for (const msg of allMessages) {
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

      // Industry: list every workshop conversation
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
        const targetId = String(customerId)
        const messages = await chats
          .find({
            workshopId: user.id,
            $or: [
              { senderId: targetId },
              { senderId: user.id, receiverId: targetId },
            ],
          })
          .sort({ createdAt: 1 })
          .toArray()

        await chats.updateMany(
          { workshopId: user.id, senderId: targetId, readByWorkshop: { $ne: true } },
          { $set: { readByWorkshop: true } }
        )

        // Presence & typing info for customer
        const targetPresence = await presence.findOne({ userId: targetId })
        const isOnline = targetPresence?.lastSeen ? (now - new Date(targetPresence.lastSeen).getTime() < 10000) : false
        const isTyping = targetPresence?.typingTo === user.id && targetPresence?.typingAt ? (now - new Date(targetPresence.typingAt).getTime() < 4000) : false

        const formatted = messages.map(m => ({
          id: m.id || String(m._id),
          workshopId: m.workshopId,
          senderId: m.senderId,
          senderName: m.senderName || 'Customer',
          text: m.text,
          createdAt: m.createdAt,
          isSelf: m.senderId === user.id,
        }))

        return res.status(200).json({ messages: formatted, isOnline, isTyping })
      }

      // Industry customer: messages with a specific workshop
      if (!workshopUser) {
        if (!workshopId) {
          return res.status(400).json({ error: 'workshopId parameter is required.' })
        }

        const targetId = String(workshopId)
        const messages = await chats
          .find({
            workshopId: targetId,
            $or: [
              { senderId: user.id },
              { senderId: targetId, receiverId: user.id },
            ],
          })
          .sort({ createdAt: 1 })
          .toArray()

        await chats.updateMany(
          { workshopId: targetId, senderId: targetId, receiverId: user.id, readByIndustry: { $ne: true } },
          { $set: { readByIndustry: true } }
        )

        // Presence & typing info for workshop
        const targetPresence = await presence.findOne({ userId: targetId })
        const isOnline = targetPresence?.lastSeen ? (now - new Date(targetPresence.lastSeen).getTime() < 10000) : false
        const isTyping = targetPresence?.typingTo === user.id && targetPresence?.typingAt ? (now - new Date(targetPresence.typingAt).getTime() < 4000) : false

        const formatted = messages.map(m => ({
          id: m.id || String(m._id),
          workshopId: m.workshopId,
          senderId: m.senderId,
          senderName: m.senderName || 'User',
          text: m.text,
          createdAt: m.createdAt,
          isSelf: m.senderId === user.id,
        }))

        return res.status(200).json({ messages: formatted, isOnline, isTyping })
      }

      return res.status(400).json({ error: 'Missing query parameters.' })
    }

    // ── POST ────────────────────────────────────────────────────────────────
    if (req.method === 'POST') {
      const { workshopId, workshopName, text, receiverId, receiverName, typingTo } = req.body || {}

      // Typing heartbeat
      if (typingTo) {
        await presence.updateOne(
          { userId: user.id },
          { $set: { userId: user.id, lastSeen: new Date(), typingTo: String(typingTo), typingAt: new Date() } },
          { upsert: true }
        )
        return res.status(200).json({ ok: true })
      }

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
        // Clear typing status on send
        await presence.updateOne({ userId: user.id }, { $unset: { typingTo: '', typingAt: '' } })

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
      // Clear typing status on send
      await presence.updateOne({ userId: user.id }, { $unset: { typingTo: '', typingAt: '' } })

      return res.status(201).json({ ...newMessage, isSelf: true })
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).json({ error: 'Method not allowed.' })
  } catch (error) {
    console.error('Chat API error:', error)
    return res.status(500).json({ error: 'Failed to process chat request.' })
  }
}
