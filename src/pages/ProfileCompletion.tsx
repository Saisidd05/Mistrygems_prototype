import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Gem, ArrowRight, Building, MapPin, User as UserIcon } from 'lucide-react'
import { GoogleDetails, useAuth } from '../context/AuthContext'
import { GlowButton } from '../components/ui/GlowButton'

export function ProfileCompletion() {
  const navigate = useNavigate()
  const { completeGoogleProfile } = useAuth()
  
  const [googleData, setGoogleData] = useState<GoogleDetails | null>(null)
  const [username, setUsername] = useState('')
  const [workshopName, setWorkshopName] = useState('')
  const [workshopAddress, setWorkshopAddress] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Retrieve temporary Google credentials from session storage
  useEffect(() => {
    try {
      const dataStr = sessionStorage.getItem('mg_google_temp')
      if (!dataStr) {
        navigate('/login')
        return
      }
      setGoogleData(JSON.parse(dataStr) as GoogleDetails)
    } catch {
      navigate('/login')
    }
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const cleanUsername = username.trim().toLowerCase()
    if (!cleanUsername) {
      setError('Please provide a username.')
      return
    }
    if (!workshopName.trim()) {
      setError('Please provide your workshop name.')
      return
    }
    if (!workshopAddress.trim()) {
      setError('Please provide your workshop address.')
      return
    }

    setLoading(true)
    try {
      if (!googleData) {
        setError('Your Google sign-in session has expired. Please sign in again.')
        return
      }
      const result = await completeGoogleProfile({
        credential: googleData.credential,
        googleId: googleData.googleId,
        email: googleData.email,
        name: googleData.name,
        profileImage: googleData.profileImage,
        username: cleanUsername,
        workshopName: workshopName.trim(),
        workshopAddress: workshopAddress.trim(),
        accountType: googleData.accountType
      })

      if (result.success) {
        sessionStorage.removeItem('mg_google_temp')
        navigate(result.redirectTo || '/login')
      } else {
        setError(result.error || 'Failed to complete profile registration.')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  if (!googleData) return null

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="w-full max-w-md glass-card p-8 relative z-10 shadow-glass-lg border-glass-bright">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#0077B6] to-[#00B4D8] shadow-glow mb-4">
            <Gem size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold font-sora gradient-text-bright">Complete Profile</h1>
          <p className="text-xs text-glass-dim mt-1">
            Almost there! Set up your {googleData.accountType === 'industry' ? 'industry' : 'workshop'} account
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-glass/10 mb-5">
          {googleData.profileImage ? (
            <img src={googleData.profileImage} alt="Google Avatar" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {googleData.name ? googleData.name[0].toUpperCase() : 'G'}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold text-highlight truncate">{googleData.name}</p>
            <p className="text-[10px] text-glass-dim truncate">{googleData.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-glass-dim mb-1.5">Choose Username</label>
            <div className="relative">
              <input
                className="glass-input pl-10"
                placeholder="e.g. janesmith"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
              <UserIcon size={16} className="absolute left-3.5 top-3.5 text-glass-dim" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-glass-dim mb-1.5">
              {googleData.accountType === 'industry' ? 'Company Name' : 'Workshop Name'}
            </label>
            <div className="relative">
              <input
                className="glass-input pl-10"
                placeholder={googleData.accountType === 'industry' ? 'e.g. Tata Motors Ltd.' : 'e.g. Apex Precision Engineering'}
                value={workshopName}
                onChange={e => setWorkshopName(e.target.value)}
                required
              />
              <Building size={16} className="absolute left-3.5 top-3.5 text-glass-dim" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-glass-dim mb-1.5">
              {googleData.accountType === 'industry' ? 'Company Address' : 'Workshop Address'}
            </label>
            <div className="relative">
              <input
                className="glass-input pl-10"
                placeholder={googleData.accountType === 'industry' ? 'e.g. Andheri East, Mumbai' : 'e.g. GIDC Area, Sector 2, Rajkot'}
                value={workshopAddress}
                onChange={e => setWorkshopAddress(e.target.value)}
                required
              />
              <MapPin size={16} className="absolute left-3.5 top-3.5 text-glass-dim" />
            </div>
          </div>

          <GlowButton type="submit" size="lg" className="w-full mt-4" loading={loading} icon={<ArrowRight size={16} />}>
            Finish Setup
          </GlowButton>
        </form>
      </div>
    </div>
  )
}
