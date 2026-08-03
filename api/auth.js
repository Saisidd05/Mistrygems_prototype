import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { getDatabase } from '../db/mongodb.js'

const scrypt = promisify(scryptCallback)

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = await scrypt(password, salt, 64)
  return `${salt}:${Buffer.from(hash).toString('hex')}`
}

async function passwordMatches(password, storedPassword) {
  const [salt, storedHash] = storedPassword.split(':')
  if (!salt || !storedHash) return false
  const suppliedHash = Buffer.from(await scrypt(password, salt, 64))
  const expectedHash = Buffer.from(storedHash, 'hex')
  return suppliedHash.length === expectedHash.length && timingSafeEqual(suppliedHash, expectedHash)
}

function publicUser(user) {
  const { _id, passwordHash, ...safeUser } = user
  return safeUser
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const { action, email, password, ...profile } = req.body || {}
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''

  if (!normalizedEmail || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  try {
    const database = await getDatabase()
    const users = database.collection('users')
    await users.createIndex({ email: 1 }, { unique: true })

    if (action === 'signup') {
      if (password.length < 6 || !profile.ownerName || !profile.workshopName || !profile.phone || !profile.address) {
        return res.status(400).json({ error: 'Please provide all required account details.' })
      }

      const user = {
        id: `USER-${Date.now()}`,
        name: String(profile.ownerName).trim(),
        email: normalizedEmail,
        role: 'owner',
        phone: String(profile.phone).trim(),
        workshop: {
          name: String(profile.workshopName).trim(),
          address: String(profile.address).trim(),
          city: String(profile.city || '').trim(),
          state: String(profile.state || '').trim(),
          zipCode: String(profile.zipCode || '').trim(),
          gstNumber: String(profile.gstNumber || '').trim(),
        },
        passwordHash: await hashPassword(password),
        createdAt: new Date().toISOString(),
      }
      await users.insertOne(user)
      return res.status(201).json({ user: publicUser(user) })
    }

    if (action === 'login') {
      const user = await users.findOne({ email: normalizedEmail })
      if (!user || !(await passwordMatches(password, user.passwordHash))) {
        return res.status(401).json({ error: 'Invalid email or password.' })
      }
      return res.status(200).json({ user: publicUser(user) })
    }

    return res.status(400).json({ error: 'Unsupported authentication action.' })
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ error: 'An account already exists for this email.' })
    console.error('Authentication request failed:', error)
    return res.status(503).json({ error: 'Authentication service is unavailable.' })
  }
}
