import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getAccountType, useAuth } from './AuthContext'

export interface IndustryRequirement {
  id: string; jobTitle: string; description: string; category: string; materialSpecification: string; manufacturingProcess: string; quantity: number; unit: string; certifications: string; deliveryDate: string; deliveryLocation: string; budget?: number; notes?: string; drawingFile?: string; technicalFile?: string; status: 'Open' | 'Closed' | 'Matched' | 'In Production'; createdAt: string; quotationsReceived: number; assignedWorkshop?: string
}

type Collection = 'industryRequirements' | 'industryQuotations' | 'industryPurchaseOrders' | 'industryVendors' | 'industryNotifications'
const api = async <T,>(collection: Collection, init?: RequestInit): Promise<T> => {
  const saved = localStorage.getItem('mistry-auth'); const token = saved ? JSON.parse(saved)?.token : ''
  const response = await fetch(`/api/data?collection=${collection}`, { ...init, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } })
  if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.error || 'Industry data request failed.') }
  return response.status === 204 ? undefined as T : response.json()
}
const makeId = () => `REQ-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

interface IndustryDataValue { requirements: IndustryRequirement[]; loading: boolean; createRequirement: (value: Omit<IndustryRequirement, 'id' | 'createdAt' | 'status' | 'quotationsReceived'>) => Promise<void>; updateRequirement: (id: string, value: Partial<IndustryRequirement>) => Promise<void>; deleteRequirement: (id: string) => Promise<void> }
const IndustryDataContext = createContext<IndustryDataValue | undefined>(undefined)

export function IndustryDataProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth(); const [requirements, setRequirements] = useState<IndustryRequirement[]>([]); const [loading, setLoading] = useState(false)
  const refresh = useCallback(async () => { setLoading(true); try { setRequirements(await api<IndustryRequirement[]>('industryRequirements')) } catch (error) { console.error(error); setRequirements([]) } finally { setLoading(false) } }, [])
  useEffect(() => { if (isAuthenticated && getAccountType(user) === 'industry') void refresh(); else setRequirements([]) }, [isAuthenticated, user, refresh])
  const createRequirement = useCallback(async (value: Omit<IndustryRequirement, 'id' | 'createdAt' | 'status' | 'quotationsReceived'>) => { const created = await api<IndustryRequirement>('industryRequirements', { method: 'POST', body: JSON.stringify({ document: { ...value, id: makeId(), status: 'Open', quotationsReceived: 0 } }) }); setRequirements(current => [created, ...current]) }, [])
  const updateRequirement = useCallback(async (id: string, value: Partial<IndustryRequirement>) => { const updated = await api<IndustryRequirement>('industryRequirements', { method: 'PUT', body: JSON.stringify({ id, updates: value }) }); setRequirements(current => current.map(item => item.id === id ? updated : item)) }, [])
  const deleteRequirement = useCallback(async (id: string) => { const saved = localStorage.getItem('mistry-auth'); const token = saved ? JSON.parse(saved)?.token : ''; const response = await fetch(`/api/data?collection=industryRequirements&id=${encodeURIComponent(id)}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); if (!response.ok) throw new Error('Unable to delete requirement.'); setRequirements(current => current.filter(item => item.id !== id)) }, [])
  return <IndustryDataContext.Provider value={{ requirements, loading, createRequirement, updateRequirement, deleteRequirement }}>{children}</IndustryDataContext.Provider>
}
export function useIndustryData() { const context = useContext(IndustryDataContext); if (!context) throw new Error('useIndustryData must be used inside IndustryDataProvider'); return context }
