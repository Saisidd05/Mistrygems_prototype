import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Gem, Lock, User, ArrowRight, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { GlowButton } from '../components/ui/GlowButton'
import { AnimatedBackground } from '../components/ui/AnimatedBackground'
import { Modal } from '../components/ui/Modal'

export function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Forgot Password state
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)

  const googleButtonRef = useRef<HTMLDivElement>(null)
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId || clientId.startsWith('YOUR_')) return

    const renderGoogleButton = () => {
      if (!window.google || !googleButtonRef.current) return
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          setError('')
          setLoading(true)
          const result = await loginWithGoogle(credential)
          setLoading(false)
          if (!result.success) {
            setError(result.error || 'Google sign-in failed.')
          } else if (result.isNewUser && result.googleDetails) {
            sessionStorage.setItem('mg_google_temp', JSON.stringify(result.googleDetails))
            navigate('/complete-profile')
          } else {
            navigate('/dashboard')
          }
        },
      })
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: 'standard', theme: 'outline', size: 'large', text: 'continue_with', width: 384,
      })
    }

    if (window.google) {
      renderGoogleButton()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = renderGoogleButton
    document.head.appendChild(script)
    return () => { script.onload = null }
  }, [loginWithGoogle, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(username, password)
      if (result.success) {
        navigate('/dashboard')
      } else {
        setError(result.error || 'Invalid username or password')
        setLoading(false)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotSuccess('')
    setForgotLoading(true)

    // Simulate sending reset link
    setTimeout(() => {
      setForgotSuccess(`Password reset instructions have been sent to ${forgotEmail}. Please check your inbox.`)
      setForgotLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      <div className="w-full max-w-md glass-card p-8 relative z-10 shadow-glass-lg border-glass-bright">

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#0077B6] to-[#00B4D8] shadow-glow mb-4">
            <Gem size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold font-sora gradient-text-bright">Mistry Gems</h1>
          <p className="text-xs text-glass-dim mt-1">MSME Manufacturing Workflow Platform</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        {/* Manual Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field with Floating Label style */}
          <div className="relative">
            <input
              type="text"
              id="login-username"
              className="peer glass-input pl-10 pt-5 pb-2 text-sm w-full bg-transparent"
              placeholder=" "
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <label
              htmlFor="login-username"
              className="absolute left-10 top-4 text-xs text-glass-dim transition-all duration-150 pointer-events-none
                peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-xs
                peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:text-accent
                peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[9px] peer-[&:not(:placeholder-shown)]:text-accent"
            >
              Username or Email
            </label>
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-glass-dim peer-focus:text-accent transition-colors" />
          </div>

          {/* Password Field with Floating Label style */}
          <div className="relative">
            <input
              type="password"
              id="login-password"
              className="peer glass-input pl-10 pt-5 pb-2 text-sm w-full bg-transparent"
              placeholder=" "
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <label
              htmlFor="login-password"
              className="absolute left-10 top-4 text-xs text-glass-dim transition-all duration-150 pointer-events-none
                peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-xs
                peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:text-accent
                peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[9px] peer-[&:not(:placeholder-shown)]:text-accent"
            >
              Password
            </label>
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-glass-dim peer-focus:text-accent transition-colors" />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setForgotSuccess('')
                setForgotEmail('')
                setShowForgotModal(true)
              }}
              className="text-[11px] text-accent hover:text-[#90E0EF] transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          <GlowButton type="submit" size="lg" className="w-full mt-2" loading={loading} icon={<ArrowRight size={16} />}>
            Sign In
          </GlowButton>
        </form>

        {import.meta.env.VITE_GOOGLE_CLIENT_ID && !import.meta.env.VITE_GOOGLE_CLIENT_ID.startsWith('YOUR_') && (
          <>
            <div className="relative my-6"><div className="border-t border-glass/10" /><span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#061c3c] px-3 text-[10px] text-glass-dim">OR</span></div>
            <div ref={googleButtonRef} className="flex justify-center" />
          </>
        )}

        {/* Signup redirection link */}
        <div className="mt-8 text-center border-t border-glass/10 pt-5">
          <p className="text-xs text-glass-dim">
            New to Mistry Gems?{' '}
            <Link to="/signup" className="text-accent font-semibold hover:text-[#90E0EF] transition-colors ml-1">
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal open={showForgotModal} onClose={() => setShowForgotModal(false)} title="Reset Password">
        <form onSubmit={handleForgotPassword} className="space-y-4 pt-2">
          <p className="text-xs text-glass-dim leading-relaxed">
            Enter the email address registered with your account, and we'll send password recovery instructions.
          </p>

          {forgotSuccess ? (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs leading-relaxed text-center">
              {forgotSuccess}
            </div>
          ) : (
            <div className="relative">
              <input
                type="email"
                className="glass-input pl-10"
                placeholder="workshop@example.com"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                required
              />
              <Mail size={16} className="absolute left-3.5 top-3.5 text-glass-dim" />
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <GlowButton type="button" variant="outline" size="sm" onClick={() => setShowForgotModal(false)}>
              Cancel
            </GlowButton>
            {!forgotSuccess && (
              <GlowButton type="submit" size="sm" loading={forgotLoading}>
                Send Instructions
              </GlowButton>
            )}
          </div>
        </form>
      </Modal>
    </div>
  )
}
