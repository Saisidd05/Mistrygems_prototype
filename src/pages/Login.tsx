import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Gem, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { GlowButton } from '../components/ui/GlowButton'
import { AnimatedBackground } from '../components/ui/AnimatedBackground'

export function Login() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('mistry123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      const success = login(username, password)
      if (success) {
        navigate('/dashboard')
      } else {
        setError('Invalid username or password')
        setLoading(false)
      }
    }, 500)
  }

  const fillQuickAccount = (u: string, p: string) => {
    setUsername(u)
    setPassword(p)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <AnimatedBackground />
      <div className="w-full max-w-md glass-card p-8 relative z-10 shadow-glass-lg border-glass-bright">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#0077B6] to-[#00B4D8] shadow-glow mb-4">
            <Gem size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold font-sora gradient-text-bright">Mistry Gems</h1>
          <p className="text-xs text-glass-dim mt-1">MSME Manufacturing Workflow Platform</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-glass-dim mb-1.5">Username</label>
            <div className="relative">
              <input
                className="glass-input pl-10"
                placeholder="admin"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
              <User size={16} className="absolute left-3.5 top-3.5 text-glass-dim" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-glass-dim mb-1.5">Password</label>
            <div className="relative">
              <input
                type="password"
                className="glass-input pl-10"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <Lock size={16} className="absolute left-3.5 top-3.5 text-glass-dim" />
            </div>
          </div>

          <GlowButton type="submit" size="lg" className="w-full mt-2" loading={loading} icon={<ArrowRight size={16} />}>
            Sign In to Platform
          </GlowButton>
        </form>

        <div className="mt-8 pt-6 border-t border-glass/10 text-center">
          <p className="text-xs text-glass-dim mb-3 flex items-center justify-center gap-1">
            <ShieldCheck size={14} className="text-accent" /> Quick Demo Sign-In
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => fillQuickAccount('admin', 'mistry123')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-glass border border-glass/10 transition-all"
            >
              Admin Demo
            </button>
            <button
              onClick={() => fillQuickAccount('ramesh', 'pass123')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-glass border border-glass/10 transition-all"
            >
              Employee Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
