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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-8">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,_#f8fbff_0%,_#eef6ff_48%,_#fdfdff_100%)]" />
      <div className="absolute -top-32 -left-20 w-72 h-72 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="absolute bottom-[-3rem] right-[-2rem] w-80 h-80 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full bg-sky-200/20 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-[28px] border border-white/70 bg-white/70 backdrop-blur-2xl shadow-[0_30px_80px_rgba(37,99,235,0.12)] p-7 sm:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/25 mb-4">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-blue-700 tracking-tight">
              Mistry Gems
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Workshop Management Platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="you@workshop.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Sign in as
              </label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-3 rounded-2xl text-left transition-all duration-200 border ${
                      selectedRole === role.id
                        ? 'bg-blue-50/80 border-blue-300/70 ring-1 ring-blue-200/80 shadow-sm'
                        : 'bg-white/70 border-slate-200/80 hover:border-blue-200/80 hover:bg-blue-50/50'
                    }`}
                  >
                    <p className={`text-sm font-bold ${selectedRole === role.id ? 'text-blue-700' : 'text-slate-700'}`}>
                      {role.label}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{role.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/25 transition-all duration-200 disabled:opacity-60"
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

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="bg-white/70 px-3 text-slate-500 uppercase tracking-wider font-medium">
                  or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-medium text-slate-700 bg-white/70 border border-slate-200/80 hover:bg-blue-50/60 hover:border-blue-200/80 transition-all duration-200"
            >
              <Chrome className="w-4 h-4 text-slate-500" />
              <span>Continue with Google</span>
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-slate-500 mt-5">
          © 2024 Mistry Gems · Workshop Management Platform
        </p>
      </motion.div>
    </div>
  )
}
