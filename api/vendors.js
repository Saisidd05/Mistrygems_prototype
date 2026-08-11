import jwt from 'jsonwebtoken'
import { getDatabase } from '../db/mongodb.js'

const JWT_SECRET = process.env.JWT_SECRET || 'mistry-gems-local-secret-key-12345'

function industryUserFromRequest(req) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return null
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET)
    const accountType = payload.accountType === 'industry' || String(payload.role || '').toLowerCase().includes('industry') ? 'industry' : 'workshop'
    return accountType === 'industry' && typeof payload.id === 'string' ? payload : null
  } catch {
    return null
  }
}

function toVendor(user) {
  const reviews = Array.isArray(user.reviews) ? user.reviews : []
  const rating = typeof user.rating === 'number'
    ? user.rating
    : reviews.length
      ? reviews.reduce((total, review) => total + (Number(review.rating) || 0), 0) / reviews.length
      : null

  return {
    id: user.id,
    name: user.workshopName || user.workshop?.name || user.name || 'Workshop',
    ownerName: user.name || '',
    address: user.workshopAddress || user.workshop?.address || '',
    email: user.email || '',
    role: user.role || 'Owner',
    avatar: user.profileImage || user.avatar || '',
    createdAt: user.createdAt || '',
    gstin: user.gstin || '',
    rating,
    reviewCount: reviews.length,
    reviews: reviews.map(review => ({
      author: review.author || 'Industry Customer',
      rating: Number(review.rating) || 0,
      comment: review.comment || '',
      date: review.date || '',
    })),
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  if (!industryUserFromRequest(req)) {
    return res.status(403).json({ error: 'Industry authorization is required.' })
  }

  try {
    const users = (await getDatabase()).collection('users')
    const workshops = await users.find({
      $or: [
        { accountType: 'workshop' },
        { accountType: { $exists: false } },
      ],
      role: { $not: /industry/i },
    }).sort({ createdAt: -1 }).toArray()

    return res.status(200).json(workshops.map(toVendor))
  } catch (error) {
    console.error('Vendor directory request failed:', error)
    return res.status(503).json({ error: 'Vendor directory is unavailable.' })
  }
}
