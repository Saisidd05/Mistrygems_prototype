import { useState } from 'react'
import { useAuth, UserRole } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn, Chrome } from 'lucide-react'

const roles: Array<{ id: UserRole; label: string; desc: string }> = [
  { id: 'owner', label: 'Owner', desc: 'Full access to everything' },
  { id: 'manager', label: 'Manager', desc: 'Jobs, tasks & team' },
  { id: 'employee', label: 'Employee', desc: 'Assigned tasks only' },
  { id: 'client', label: 'Client', desc: 'View your jobs' },
]

const roleNames: Record<UserRole, string> = {
  owner: 'Workshop Owner',
  manager: 'Production Manager',
  employee: 'Machine Operator',
  client: 'Client User',
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole>('owner')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      login(selectedRole, email || 'user@mistrygems.com', roleNames[selectedRole])
      navigate('/dashboard')
    }, 600)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] relative overflow-hidden">
      {/* Ambient background orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-md mx-4"
      >
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-black/40 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/25 mb-4">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-orange-500 tracking-tight">
              Mistry Gems
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Workshop Management Platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="you@workshop.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm bg-slate-800/60 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm bg-slate-800/60 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition-all"
                />
              </div>
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Sign in as
              </label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-3 rounded-xl text-left transition-all duration-200 border ${
                      selectedRole === role.id
                        ? 'bg-orange-500/15 border-orange-500/40 ring-1 ring-orange-500/30'
                        : 'bg-slate-800/40 border-slate-700/30 hover:border-slate-600/50'
                    }`}
                  >
                    <p className={`text-sm font-bold ${
                      selectedRole === role.id ? 'text-orange-400' : 'text-slate-300'
                    }`}>
                      {role.label}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{role.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Sign In Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50" />
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="bg-slate-900/80 px-3 text-slate-500 uppercase tracking-wider font-medium">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-medium text-slate-300 bg-slate-800/40 border border-slate-700/40 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-200"
            >
              <Chrome className="w-4 h-4 text-slate-400" />
              <span>Continue with Google</span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-600 mt-5">
          © 2024 Mistry Gems · Workshop Management Platform
        </p>
      </motion.div>
    </div>
  )
}
