import { MongoClient } from 'mongodb'

let clientPromise

export async function getDatabase() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not configured')

  if (!clientPromise) {
    clientPromise = new MongoClient(uri).connect()
  }

  const client = await clientPromise
  return client.db(process.env.MONGODB_DB || 'mistry_gems')
}

// Industry records are deliberately stored apart from workshop operational data.
// This uses the configured database name as a stable prefix without requiring a
// new deployment environment variable.
export async function getIndustryDatabase() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not configured')
  if (!clientPromise) clientPromise = new MongoClient(uri).connect()
  const client = await clientPromise
  return client.db(`${process.env.MONGODB_DB || 'mistry_gems'}_industry`)
}
