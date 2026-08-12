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
    phone: user.phone || user.phoneNumber || user.workshopPhone || user.mobile || '+91 98765 43210',
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
  const userPayload = industryUserFromRequest(req)
  if (!userPayload) {
    return res.status(403).json({ error: 'Industry authorization is required.' })
  }

  if (req.method === 'GET') {
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

  if (req.method === 'POST') {
    const { action, workshopId, rating, comment } = req.body || {}
    if (action === 'review' || (workshopId && rating)) {
      if (!workshopId || !rating) {
        return res.status(400).json({ error: 'Workshop ID and star rating are required.' })
      }
      const numRating = Number(rating)
      if (Number.isNaN(numRating) || numRating < 1 || numRating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5 stars.' })
      }

      try {
        const users = (await getDatabase()).collection('users')
        const workshop = await users.findOne({ id: workshopId })
        if (!workshop) {
          return res.status(404).json({ error: 'Workshop not found.' })
        }

        const existingReviews = Array.isArray(workshop.reviews) ? workshop.reviews : []
        const userExistingIndex = existingReviews.findIndex(r => r.userId === userPayload.id || r.author === userPayload.name)

        const newReview = {
          userId: userPayload.id,
          author: userPayload.name || 'Industry Customer',
          rating: numRating,
          comment: (comment || '').trim(),
          date: new Date().toISOString(),
        }

        let updatedReviews
        if (userExistingIndex >= 0) {
          updatedReviews = [...existingReviews]
          updatedReviews[userExistingIndex] = newReview
        } else {
          updatedReviews = [newReview, ...existingReviews]
        }

        const avgRating = updatedReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / updatedReviews.length

        await users.updateOne(
          { id: workshopId },
          { $set: { reviews: updatedReviews, rating: avgRating } }
        )

        const updatedWorkshop = await users.findOne({ id: workshopId })
        return res.status(200).json({ success: true, vendor: toVendor(updatedWorkshop) })
      } catch (err) {
        console.error('Submit review error:', err)
        return res.status(500).json({ error: 'Failed to submit review.' })
      }
    }

    return res.status(400).json({ error: 'Unsupported vendor action.' })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: 'Method not allowed.' })
}

