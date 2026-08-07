import React, { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { Gem, Mail, Lock, User, Building, MapPin, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { GlowButton } from '../components/ui/GlowButton'
import { AnimatedBackground } from '../components/ui/AnimatedBackground'

export default function Signup() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { signup } = useAuth()
  const accountType = searchParams.get('type') === 'industry' ? 'industry' : 'workshop'
  const accountLabel = accountType === 'industry' ? 'Industry' : 'Workshop'

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    workshopName: '',
    workshopAddress: '',
    password: '',
    confirmPassword: '',
  })

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }))
    }
    setError('')
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) errors.name = 'Full Name is required.'

    const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/
    if (!formData.username.trim()) {
      errors.username = 'Username is required.'
    } else if (!usernameRegex.test(formData.username)) {
      errors.username = 'Username must be 3-15 chars (alphanumeric or underscore).'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      errors.email = 'Email Address is required.'
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address.'
    }

    if (!formData.workshopName.trim()) errors.workshopName = `${accountLabel} Name is required.`
    if (!formData.workshopAddress.trim()) errors.workshopAddress = `${accountLabel} Address is required.`

    if (!formData.password) {
      errors.password = 'Password is required.'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters.'
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setLoading(true)
    try {
      const result = await signup({
        name: formData.name.trim(),
        username: formData.username.trim().toLowerCase(),
        email: formData.email.trim().toLowerCase(),
        workshopName: formData.workshopName.trim(),
        workshopAddress: formData.workshopAddress.trim(),
        password: formData.password,
        accountType
      })

      if (result.success) {
        navigate('/dashboard')
      } else {
        const errMsg = result.error || ''
        if (errMsg.toLowerCase().includes('email')) {
          setFieldErrors(prev => ({ ...prev, email: 'Email address is already in use.' }))
        } else if (errMsg.toLowerCase().includes('username')) {
          setFieldErrors(prev => ({ ...prev, username: 'Username is already taken.' }))
        } else {
          setError(errMsg || 'Registration failed. Please check details.')
        }
        setLoading(false)
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during signup.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-y-auto py-10">
      <AnimatedBackground />
      <div className="w-full max-w-lg glass-card p-8 relative z-10 shadow-glass-lg border-glass-bright">

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#0077B6] to-[#00B4D8] shadow-glow mb-3">
            <Gem size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold font-sora gradient-text-bright">Create {accountLabel} Account</h1>
          <p className="text-xs text-glass-dim mt-1">Set up your smart {accountType} management platform</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              name="name"
              id="signup-name"
              className="peer glass-input pl-10 pt-5 pb-2 text-sm w-full bg-transparent"
              placeholder=" "
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label
              htmlFor="signup-name"
              className="absolute left-10 top-4 text-xs text-glass-dim transition-all duration-150 pointer-events-none
                peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-xs
                peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:text-accent
                peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[9px] peer-[&:not(:placeholder-shown)]:text-accent"
            >
              Full Name
            </label>
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-glass-dim peer-focus:text-accent transition-colors" />
            {fieldErrors.name && (
              <span className="text-[10px] text-red-400 mt-1 block pl-2">{fieldErrors.name}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Username */}
            <div className="relative">
              <input
                type="text"
                name="username"
                id="signup-username"
                className="peer glass-input pl-10 pt-5 pb-2 text-sm w-full bg-transparent"
                placeholder=" "
                value={formData.username}
                onChange={handleChange}
                required
              />
              <label
                htmlFor="signup-username"
                className="absolute left-10 top-4 text-xs text-glass-dim transition-all duration-150 pointer-events-none
                  peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-xs
                  peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:text-accent
                  peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[9px] peer-[&:not(:placeholder-shown)]:text-accent"
              >
                Username
              </label>
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-glass-dim peer-focus:text-accent transition-colors" />
              {fieldErrors.username && (
                <span className="text-[10px] text-red-400 mt-1 block pl-2">{fieldErrors.username}</span>
              )}
            </div>

            {/* Email Address */}
            <div className="relative">
              <input
                type="email"
                name="email"
                id="signup-email"
                className="peer glass-input pl-10 pt-5 pb-2 text-sm w-full bg-transparent"
                placeholder=" "
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label
                htmlFor="signup-email"
                className="absolute left-10 top-4 text-xs text-glass-dim transition-all duration-150 pointer-events-none
                  peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-xs
                  peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:text-accent
                  peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[9px] peer-[&:not(:placeholder-shown)]:text-accent"
              >
                Email Address
              </label>
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-glass-dim peer-focus:text-accent transition-colors" />
              {fieldErrors.email && (
                <span className="text-[10px] text-red-400 mt-1 block pl-2">{fieldErrors.email}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Workshop Name */}
            <div className="relative">
              <input
                type="text"
                name="workshopName"
                id="signup-workshopName"
                className="peer glass-input pl-10 pt-5 pb-2 text-sm w-full bg-transparent"
                placeholder=" "
                value={formData.workshopName}
                onChange={handleChange}
                required
              />
              <label
                htmlFor="signup-workshopName"
                className="absolute left-10 top-4 text-xs text-glass-dim transition-all duration-150 pointer-events-none
                  peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-xs
                  peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:text-accent
                  peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[9px] peer-[&:not(:placeholder-shown)]:text-accent"
              >
                {accountLabel} Name
              </label>
              <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-glass-dim peer-focus:text-accent transition-colors" />
              {fieldErrors.workshopName && (
                <span className="text-[10px] text-red-400 mt-1 block pl-2">{fieldErrors.workshopName}</span>
              )}
            </div>

            {/* Workshop Address */}
            <div className="relative">
              <input
                type="text"
                name="workshopAddress"
                id="signup-workshopAddress"
                className="peer glass-input pl-10 pt-5 pb-2 text-sm w-full bg-transparent"
                placeholder=" "
                value={formData.workshopAddress}
                onChange={handleChange}
                required
              />
              <label
                htmlFor="signup-workshopAddress"
                className="absolute left-10 top-4 text-xs text-glass-dim transition-all duration-150 pointer-events-none
                  peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-xs
                  peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:text-accent
                  peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[9px] peer-[&:not(:placeholder-shown)]:text-accent"
              >
                {accountLabel} Address
              </label>
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-glass-dim peer-focus:text-accent transition-colors" />
              {fieldErrors.workshopAddress && (
                <span className="text-[10px] text-red-400 mt-1 block pl-2">{fieldErrors.workshopAddress}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div className="relative">
              <input
                type="password"
                name="password"
                id="signup-password"
                className="peer glass-input pl-10 pt-5 pb-2 text-sm w-full bg-transparent"
                placeholder=" "
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label
                htmlFor="signup-password"
                className="absolute left-10 top-4 text-xs text-glass-dim transition-all duration-150 pointer-events-none
                  peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-xs
                  peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:text-accent
                  peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[9px] peer-[&:not(:placeholder-shown)]:text-accent"
              >
                Password
              </label>
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-glass-dim peer-focus:text-accent transition-colors" />
              {fieldErrors.password && (
                <span className="text-[10px] text-red-400 mt-1 block pl-2">{fieldErrors.password}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                id="signup-confirmPassword"
                className="peer glass-input pl-10 pt-5 pb-2 text-sm w-full bg-transparent"
                placeholder=" "
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <label
                htmlFor="signup-confirmPassword"
                className="absolute left-10 top-4 text-xs text-glass-dim transition-all duration-150 pointer-events-none
                  peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-xs
                  peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:text-accent
                  peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[9px] peer-[&:not(:placeholder-shown)]:text-accent"
              >
                Confirm Password
              </label>
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-glass-dim peer-focus:text-accent transition-colors" />
              {fieldErrors.confirmPassword && (
                <span className="text-[10px] text-red-400 mt-1 block pl-2">{fieldErrors.confirmPassword}</span>
              )}
            </div>
          </div>

          <GlowButton type="submit" size="lg" className="w-full mt-4" loading={loading} icon={<ArrowRight size={16} />}>
            Create Account
          </GlowButton>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="border-t border-glass/10" />
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#061c3c] px-3 text-[10px] text-glass-dim tracking-wider font-semibold">
            OR SIGN UP WITH
          </span>
        </div>

        {/* Google Authentication Link */}
        <Link
          to={`/login?type=${accountType}`}
          className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-sm flex items-center justify-center transition-all duration-200 shadow-sm hover:border-accent/40"
        >
          <svg className="w-5 h-5 mr-2.5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </Link>

        {/* Login redirection */}
        <div className="mt-6 text-center border-t border-glass/10 pt-4">
          <p className="text-xs text-glass-dim">
            Already have a {accountType} account?{' '}
            <Link to={`/login?type=${accountType}`} className="text-accent font-semibold hover:text-[#90E0EF] transition-colors ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
