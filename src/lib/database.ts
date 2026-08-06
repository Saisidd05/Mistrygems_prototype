export type DatabaseCollection =
  | 'customers'
  | 'employees'
  | 'finishedGoods'
  | 'invoices'
  | 'jobs'
  | 'notifications'
  | 'rawMaterials'
  | 'tasks'

const endpoint = (collection: DatabaseCollection) =>
  `/api/data?collection=${encodeURIComponent(collection)}`

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  // Attach the current user's id to API requests so server can scope data per-user
  let userId: string | undefined
  let token: string | undefined
  try {
    const saved = localStorage.getItem('mistry-auth')
    if (saved) {
      const parsed = JSON.parse(saved)
      userId = parsed?.id || parsed?.userId || parsed?.userID || parsed?.user?.id
      token = parsed?.token
    }
  } catch {}

  const headers = { 'Content-Type': 'application/json', ...(init?.headers || {}) } as Record<string,string>
  if (userId) headers['x-user-id'] = String(userId)
  if (token) headers['Authorization'] = `Bearer ${token}`

  const response = await fetch(url, {
    headers,
    ...init,
  })

  if (!response.ok) {
    const message = await response.json().catch(() => ({ error: 'Database request failed.' }))
    throw new Error(message.error || 'Database request failed.')
  }

  return response.status === 204 ? (undefined as T) : response.json() as Promise<T>
}

export const database = {
  list: <T>(collection: DatabaseCollection) => request<T[]>(endpoint(collection)),
  create: <T>(collection: DatabaseCollection, document: T) =>
    request<T>(endpoint(collection), { method: 'POST', body: JSON.stringify({ document }) }),
  update: <T extends { id: string }>(collection: DatabaseCollection, id: string, updates: Partial<T>) =>
    request<T>(endpoint(collection), { method: 'PUT', body: JSON.stringify({ id, updates }) }),
  remove: (collection: DatabaseCollection, id: string) =>
    request<void>(`${endpoint(collection)}&id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
}
