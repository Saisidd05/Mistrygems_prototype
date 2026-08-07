import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDatabase } from '../db/mongodb.js'

const scrypt = promisify(scryptCallback)
const JWT_SECRET = process.env.JWT_SECRET || 'mistry-gems-local-secret-key-12345'
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID

// Legacy scrypt verification helper for existing users in database
async function verifyScryptPassword(password, storedPassword) {
  const [salt, storedHash] = storedPassword.split(':')
  if (!salt || !storedHash) return false
  const suppliedHash = Buffer.from(await scrypt(password, salt, 64))
  const expectedHash = Buffer.from(storedHash, 'hex')
  return suppliedHash.length === expectedHash.length && timingSafeEqual(suppliedHash, expectedHash)
}

async function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

async function passwordMatches(password, storedPassword) {
  if (storedPassword.startsWith('$2')) {
    return bcrypt.compare(password, storedPassword)
  }
  return verifyScryptPassword(password, storedPassword)
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

function publicUser(user) {
  const { _id, passwordHash, ...safeUser } = user
  // Ensure compatibility with frontend avatar rendering
  safeUser.avatar = safeUser.profileImage || safeUser.avatar || (safeUser.name ? safeUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U')
  return safeUser
}

function authenticatedUserId(req) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return null
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET)
    return typeof payload.id === 'string' ? payload.id : null
  } catch {
    return null
  }
}

async function verifyGoogleCredential(credential) {
  if (!credential) return null

  if (credential.startsWith('demo_google_')) {
    try {
      const base64Data = credential.replace('demo_google_', '')
      const jsonStr = Buffer.from(base64Data, 'base64').toString('utf-8')
      const payload = JSON.parse(jsonStr)
      if (payload.email && payload.sub) {
        return payload
      }
    } catch (e) {
      console.error('Failed to parse demo Google credential:', e)
    }
  }

  try {
    const googleVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
    const verifyResponse = await fetch(googleVerifyUrl)
    if (!verifyResponse.ok) return null
    const payload = await verifyResponse.json()
    if (!payload.email || !payload.email_verified || !payload.sub) {
      return null
    }
    if (GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.startsWith('YOUR_')) {
      if (payload.aud !== GOOGLE_CLIENT_ID) return null
    }
    return payload
  } catch (err) {
    console.error('Google credential verification error:', err)
    return null
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const { action, email, username, password, credential, accountType, ...profile } = req.body || {}
  const normalizedAccountType = accountType === 'industry' ? 'industry' : 'workshop'
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
  const normalizedUsername = typeof username === 'string' ? username.trim().toLowerCase() : ''

  try {
    const database = await getDatabase()
    const users = database.collection('users')

    // Create indexes when possible, but do not prevent existing users from
    // logging in if legacy records contain duplicates from before the index.
    try {
      await users.createIndex({ email: 1 }, { unique: true })
      await users.createIndex({ username: 1 }, { unique: true })
    } catch (indexError) {
      if (indexError?.code !== 11000) throw indexError
      console.warn('User uniqueness indexes could not be created because legacy duplicates exist.')
    }

    if (action === 'update-profile') {
      const userId = authenticatedUserId(req)
      if (!userId) return res.status(401).json({ error: 'A valid authentication token is required.' })
      const workshopName = typeof profile.workshopName === 'string' ? profile.workshopName.trim() : ''
      const workshopAddress = typeof profile.workshopAddress === 'string' ? profile.workshopAddress.trim() : ''
      const gstin = typeof profile.gstin === 'string' ? profile.gstin.trim() : ''
      if (!workshopName || !workshopAddress) return res.status(400).json({ error: 'Workshop name and address are required.' })
      const result = await users.findOneAndUpdate(
        { id: userId },
        { $set: { workshopName, workshopAddress, gstin, workshop: { name: workshopName, address: workshopAddress } } },
        { returnDocument: 'after' }
      )
      if (!result.value) return res.status(404).json({ error: 'User profile not found.' })
      return res.status(200).json({ user: publicUser(result.value) })
    }

    // Action 1: Manual Sign Up
    if (action === 'signup') {
      if (!profile.name || !normalizedUsername || !normalizedEmail || !password || !profile.workshopName || !profile.workshopAddress) {
        return res.status(400).json({ error: 'Please provide all required account details.' })
      }
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long.' })
      }

      // Check unique constraints
      const emailExists = await users.findOne({ email: normalizedEmail })
      if (emailExists) {
        return res.status(409).json({ error: 'An account already exists for this email.' })
      }
      const usernameExists = await users.findOne({ username: normalizedUsername })
      if (usernameExists) {
        return res.status(409).json({ error: 'This username is already taken.' })
      }

      const user = {
        id: `USER-${Date.now()}`,
        name: String(profile.name).trim(),
        username: normalizedUsername,
        email: normalizedEmail,
        workshopName: String(profile.workshopName).trim(),
        workshopAddress: String(profile.workshopAddress).trim(),
        workshop: {
          name: String(profile.workshopName).trim(),
          address: String(profile.workshopAddress).trim()
        },
        passwordHash: await hashPassword(password),
        authProvider: 'local',
        role: 'Owner',
        accountType: normalizedAccountType,
        createdAt: new Date().toISOString()
      }

      await users.insertOne(user)
      const token = generateToken(user)
      return res.status(201).json({ token, user: publicUser(user) })
    }

    // Action 2: Manual Login
    if (action === 'login') {
      const loginQuery = normalizedEmail || normalizedUsername
      if (!loginQuery || !password) {
        return res.status(400).json({ error: 'Username/Email and password are required.' })
      }

      const user = await users.findOne({
        $or: [
          { email: loginQuery },
          { username: loginQuery }
        ]
      })

      if (!user || !(await passwordMatches(password, user.passwordHash))) {
        return res.status(401).json({ error: 'Invalid username/email or password.' })
      }

      // Existing accounts without an accountType remain workshop accounts.
      const userAccountType = user.accountType || 'workshop'
      if (userAccountType !== normalizedAccountType) {
        return res.status(403).json({ error: `This account is registered for ${userAccountType === 'industry' ? 'Industry' : 'Workshop'} Login.` })
      }

      // Migration: transparently upgrade legacy scrypt hashes to bcrypt on login
      if (!user.passwordHash.startsWith('$2')) {
        const newHash = await hashPassword(password)
        await users.updateOne({ id: user.id }, { $set: { passwordHash: newHash } })
      }

      const token = generateToken(user)
      return res.status(200).json({ token, user: publicUser(user) })
    }

    // Action 3: Google Token Authentication
    if (action === 'google') {
      if (!credential) {
        return res.status(400).json({ error: 'Google credential token is required.' })
      }

      const payload = await verifyGoogleCredential(credential)
      if (!payload) {
        return res.status(401).json({ error: 'Invalid Google credential token.' })
      }

      const googleEmail = payload.email.trim().toLowerCase()
      const googleId = payload.sub

      // Lookup user in DB
      let user = await users.findOne({
        $or: [
          { googleId: googleId },
          { email: googleEmail }
        ]
      })

      if (user) {
        const userAccountType = user.accountType || 'workshop'
        if (userAccountType !== normalizedAccountType) {
          return res.status(403).json({ error: `This account is registered for ${userAccountType === 'industry' ? 'Industry' : 'Workshop'} Login.` })
        }
        // If they already signed up via email/password but now log in with Google,
        // link their Google Account details to the existing user.
        if (!user.googleId) {
          await users.updateOne(
            { id: user.id },
            { $set: { googleId: googleId, authProvider: 'google', profileImage: payload.picture } }
          )
          user.googleId = googleId
          user.authProvider = 'google'
          user.profileImage = payload.picture
        }
        const token = generateToken(user)
        return res.status(200).json({ token, user: publicUser(user) })
      } else {
        // Redirect to profile completion
        return res.status(200).json({
          isNewUser: true,
          googleId: googleId,
          email: googleEmail,
          name: payload.name || '',
          profileImage: payload.picture || ''
        })
      }
    }

    // Action 4: Google Signup Profile Completion
    if (action === 'complete-profile') {
      const { credential: profileCredential, workshopName, workshopAddress, accountType: profileAccountType } = req.body || {}
      const payload = await verifyGoogleCredential(profileCredential)
      if (!payload || !normalizedUsername || !workshopName || !workshopAddress) {
        return res.status(400).json({ error: 'Please provide all profile completion fields.' })
      }

      const googleId = payload.sub
      const googleEmail = payload.email.trim().toLowerCase()
      const name = payload.name || ''
      const profileImage = payload.picture || null

      const existingGoogleUser = await users.findOne({ googleId })
      if (existingGoogleUser) {
        return res.status(409).json({ error: 'This Google account is already linked to an existing user.' })
      }

      const emailExists = await users.findOne({ email: googleEmail })
      if (emailExists) {
        return res.status(409).json({ error: 'An account already exists for this email.' })
      }
      const usernameExists = await users.findOne({ username: normalizedUsername })
      if (usernameExists) {
        return res.status(409).json({ error: 'This username is already taken.' })
      }

      const user = {
        id: `USER-${Date.now()}`,
        name: String(name || '').trim(),
        username: normalizedUsername,
        email: googleEmail,
        workshopName: String(workshopName).trim(),
        workshopAddress: String(workshopAddress).trim(),
        workshop: {
          name: String(workshopName).trim(),
          address: String(workshopAddress).trim()
        },
        googleId: googleId,
        profileImage: profileImage || null,
        authProvider: 'google',
        role: 'Owner',
        accountType: profileAccountType === 'industry' ? 'industry' : 'workshop',
        createdAt: new Date().toISOString()
      }

      await users.insertOne(user)
      const token = generateToken(user)
      return res.status(201).json({ token, user: publicUser(user) })
    }

    return res.status(400).json({ error: 'Unsupported authentication action.' })
  } catch (error) {
    if (error?.code === 11000 && (action === 'signup' || action === 'complete-profile')) {
      return res.status(409).json({ error: 'An account already exists with that email or username.' })
    }
    console.error('Authentication request failed:', error)
    return res.status(503).json({ error: 'Authentication service is unavailable.' })
  }
}
