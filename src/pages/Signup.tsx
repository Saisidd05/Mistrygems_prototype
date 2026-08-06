import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Gem, Mail, Lock, User, Building, MapPin, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { GlowButton } from '../components/ui/GlowButton'
import { AnimatedBackground } from '../components/ui/AnimatedBackground'

export default function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()

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

    if (!formData.workshopName.trim()) errors.workshopName = 'Workshop Name is required.'
    if (!formData.workshopAddress.trim()) errors.workshopAddress = 'Workshop Address is required.'

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
        password: formData.password
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
          <h1 className="text-2xl font-bold font-sora gradient-text-bright">Create Workshop Account</h1>
          <p className="text-xs text-glass-dim mt-1">Set up your smart workshop management platform</p>
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
            <User size={16} className="absolute left-3.5 top-4.5 text-glass-dim peer-focus:text-accent transition-colors" />
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
              <User size={16} className="absolute left-3.5 top-4.5 text-glass-dim peer-focus:text-accent transition-colors" />
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
              <Mail size={16} className="absolute left-3.5 top-4.5 text-glass-dim peer-focus:text-accent transition-colors" />
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
                Workshop Name
              </label>
              <Building size={16} className="absolute left-3.5 top-4.5 text-glass-dim peer-focus:text-accent transition-colors" />
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
                Workshop Address
              </label>
              <MapPin size={16} className="absolute left-3.5 top-4.5 text-glass-dim peer-focus:text-accent transition-colors" />
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
              <Lock size={16} className="absolute left-3.5 top-4.5 text-glass-dim peer-focus:text-accent transition-colors" />
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
              <Lock size={16} className="absolute left-3.5 top-4.5 text-glass-dim peer-focus:text-accent transition-colors" />
              {fieldErrors.confirmPassword && (
                <span className="text-[10px] text-red-400 mt-1 block pl-2">{fieldErrors.confirmPassword}</span>
              )}
            </div>
          </div>

          <GlowButton type="submit" size="lg" className="w-full mt-4" loading={loading} icon={<ArrowRight size={16} />}>
            Create Account
          </GlowButton>
        </form>

        {/* Login redirection */}
        <div className="mt-6 text-center border-t border-glass/10 pt-4">
          <p className="text-xs text-glass-dim">
            Already have a workshop account?{' '}
            <Link to="/login" className="text-accent font-semibold hover:text-[#90E0EF] transition-colors ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
