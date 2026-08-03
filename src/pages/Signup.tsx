import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn, Chrome, MapPin, Phone, Building2, User } from 'lucide-react'

export default function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    ownerName: '',
    workshopName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    gstNumber: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.ownerName || !formData.workshopName || !formData.email || !formData.password || !formData.phone || !formData.address) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      // Here you would normally send this to a backend API
      console.log('Signup data:', formData)
      // For now, just navigate to login
      navigate('/login')
    }, 800)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
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
        className="relative w-full max-w-2xl"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Hidden Reveal Layer */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-[28px] pointer-events-none z-40"
            style={{
              background: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, rgba(37, 99, 235, 0.15), transparent 80%)`,
            }}
          />
        )}

        <div className="rounded-[28px] border border-white/70 bg-white/70 backdrop-blur-2xl shadow-[0_30px_80px_rgba(37,99,235,0.12)] p-7 sm:p-8 relative max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/25 mb-4">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-blue-700 tracking-tight">
              Create Workshop Account
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Set up your workshop management platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50/80 border border-red-200/70 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Owner Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Owner Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="ownerName"
                    placeholder="Your full name"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-slate-700 placeholder-slate-400 bg-white/60 border border-slate-200/70 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Workshop Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="workshopName"
                    placeholder="Your workshop name"
                    value={formData.workshopName}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-slate-700 placeholder-slate-400 bg-white/60 border border-slate-200/70 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="workshop@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-slate-700 placeholder-slate-400 bg-white/60 border border-slate-200/70 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-slate-700 placeholder-slate-400 bg-white/60 border border-slate-200/70 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-slate-700 placeholder-slate-400 bg-white/60 border border-slate-200/70 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-slate-700 placeholder-slate-400 bg-white/60 border border-slate-200/70 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Workshop Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="address"
                  placeholder="Street address, building name, etc."
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-slate-700 placeholder-slate-400 bg-white/60 border border-slate-200/70 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>

            {/* Location Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl text-sm text-slate-700 placeholder-slate-400 bg-white/60 border border-slate-200/70 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl text-sm text-slate-700 placeholder-slate-400 bg-white/60 border border-slate-200/70 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  placeholder="PIN/ZIP"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl text-sm text-slate-700 placeholder-slate-400 bg-white/60 border border-slate-200/70 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>

            {/* GST */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                GST Number (Optional)
              </label>
              <input
                type="text"
                name="gstNumber"
                placeholder="22ABCDE1234F2Z0"
                value={formData.gstNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl text-sm text-slate-700 placeholder-slate-400 bg-white/60 border border-slate-200/70 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/25 transition-all duration-200 disabled:opacity-60 mt-6"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Create Workshop Account</span>
                </>
              )}
            </motion.button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="bg-white/70 px-3 text-slate-500 uppercase tracking-wider font-medium">
                  already have account?
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-medium text-slate-700 bg-white/70 border border-slate-200/80 hover:bg-blue-50/60 hover:border-blue-200/80 transition-all duration-200"
            >
              <span>Sign In Instead</span>
            </button>
          </form>

          <p className="text-center text-[11px] text-slate-500 mt-5">
            © 2024 Mistry Gems · Workshop Management Platform
          </p>
        </div>
      </motion.div>
    </div>
  )
}
