import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { Gem, Lock, User, ArrowRight, Mail, CheckCircle2, Building2, Wrench } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { GlowButton } from '../components/ui/GlowButton'
import { AnimatedBackground } from '../components/ui/AnimatedBackground'
import { Modal } from '../components/ui/Modal'

const GoogleIcon = () => (
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
)

export function Login() {
  const [searchParams] = useSearchParams()
  const [accountType, setAccountType] = useState<'workshop' | 'industry'>(searchParams.get('type') === 'industry' ? 'industry' : 'workshop')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Forgot Password state
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)

  // Google Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false)
  const [customGoogleEmail, setCustomGoogleEmail] = useState('')
  const [customGoogleName, setCustomGoogleName] = useState('')

  const googleButtonRef = useRef<HTMLDivElement>(null)
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const isRealGoogleConfigured = Boolean(
    import.meta.env.VITE_GOOGLE_CLIENT_ID &&
    !import.meta.env.VITE_GOOGLE_CLIENT_ID.startsWith('YOUR_')
  )

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
          const result = await loginWithGoogle(credential, accountType)
          setLoading(false)
          if (!result.success) {
            setError(result.error || 'Google sign-in failed.')
          } else if (result.isNewUser && result.googleDetails) {
            sessionStorage.setItem('mg_google_temp', JSON.stringify(result.googleDetails))
            navigate('/complete-profile')
          } else {
            navigate(result.redirectTo || '/login')
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
  }, [loginWithGoogle, navigate, accountType])

  const handleGoogleSignInDemo = async (email: string, name: string, picture?: string) => {
    setError('')
    setLoading(true)
    setShowGoogleModal(false)

    const payload = {
      sub: `google-${Date.now()}`,
      email: email.trim().toLowerCase(),
      name: name.trim(),
      picture: picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0077B6&color=fff`,
      email_verified: true,
    }
    const demoCredential = 'demo_google_' + btoa(JSON.stringify(payload))

    try {
      const result = await loginWithGoogle(demoCredential, accountType)
      setLoading(false)
      if (!result.success) {
        setError(result.error || 'Google authentication failed.')
      } else if (result.isNewUser && result.googleDetails) {
        sessionStorage.setItem('mg_google_temp', JSON.stringify(result.googleDetails))
        navigate('/complete-profile')
      } else {
        navigate(result.redirectTo || '/login')
      }
    } catch (err: unknown) {
      setLoading(false)
      setError(err instanceof Error ? err.message : 'Google authentication failed.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(username, password, accountType)
      if (result.success) {
        navigate(result.redirectTo || '/login')
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
          <p className="text-xs text-glass-dim mt-1">Choose how you want to sign in</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-6" role="tablist" aria-label="Login type">
          <button
            type="button"
            onClick={() => { setAccountType('workshop'); setError('') }}
            className={`rounded-xl border p-3 text-left transition-all ${accountType === 'workshop' ? 'border-accent bg-accent/10 shadow-glow' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
            aria-selected={accountType === 'workshop'}
          >
            <Wrench size={18} className="mb-2 text-accent" />
            <span className="block text-xs font-semibold text-white">Workshop Login</span>
            <span className="block mt-0.5 text-[10px] text-glass-dim">Manage your workshop</span>
          </button>
          <button
            type="button"
            onClick={() => { setAccountType('industry'); setError('') }}
            className={`rounded-xl border p-3 text-left transition-all ${accountType === 'industry' ? 'border-accent bg-accent/10 shadow-glow' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
            aria-selected={accountType === 'industry'}
          >
            <Building2 size={18} className="mb-2 text-accent" />
            <span className="block text-xs font-semibold text-white">Industry Login</span>
            <span className="block mt-0.5 text-[10px] text-glass-dim">Access your industry account</span>
          </button>
        </div>

        {/* Manual Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field */}
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

          {/* Password Field */}
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
            Sign in to {accountType === 'workshop' ? 'Workshop' : 'Industry'}
          </GlowButton>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="border-t border-glass/10" />
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#061c3c] px-3 text-[10px] text-glass-dim tracking-wider font-semibold">
            OR CONTINUE WITH
          </span>
        </div>

        {/* Google Authentication Section */}
        {isRealGoogleConfigured ? (
          <div ref={googleButtonRef} className="flex justify-center min-h-[44px]" />
        ) : (
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-sm flex items-center justify-center transition-all duration-200 shadow-sm hover:border-accent/40 active:scale-[0.99]"
          >
            <GoogleIcon />
            <span>Sign in with Google</span>
          </button>
        )}

        {/* Signup redirection link */}
        <div className="mt-8 text-center border-t border-glass/10 pt-5">
          <p className="text-xs text-glass-dim">
            New to Mistry Gems?{' '}
            <Link to={`/signup?type=${accountType}`} className="text-accent font-semibold hover:text-[#90E0EF] transition-colors ml-1">
              Create {accountType === 'workshop' ? 'Workshop' : 'Industry'} Account
            </Link>
          </p>
        </div>
      </div>

      {/* Google Auth Modal Fallback */}
      <Modal open={showGoogleModal} onClose={() => setShowGoogleModal(false)} title="Google Sign-In">
        <div className="space-y-4 pt-1">
          <p className="text-xs text-glass-dim leading-relaxed">
            Select a Google account or enter your email to continue with Google Authentication.
          </p>

          {/* Quick Preset Accounts */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleGoogleSignInDemo('rajesh.mistry@gmail.com', 'Rajesh Mistry')}
              className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/50 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                  RM
                </div>
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-accent transition-colors">Rajesh Mistry</div>
                  <div className="text-[10px] text-glass-dim">rajesh.mistry@gmail.com</div>
                </div>
              </div>
              <CheckCircle2 size={16} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              type="button"
              onClick={() => handleGoogleSignInDemo('vikram.gems@gmail.com', 'Vikram Sharma')}
              className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/50 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs">
                  VS
                </div>
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-accent transition-colors">Vikram Sharma</div>
                  <div className="text-[10px] text-glass-dim">vikram.gems@gmail.com</div>
                </div>
              </div>
              <CheckCircle2 size={16} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          <div className="relative my-3">
            <div className="border-t border-glass/10" />
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#0d2240] px-2 text-[9px] text-glass-dim uppercase">or enter custom email</span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!customGoogleEmail) return
              const name = customGoogleName || customGoogleEmail.split('@')[0]
              handleGoogleSignInDemo(customGoogleEmail, name)
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-[11px] text-glass-dim mb-1">Google Email</label>
              <input
                type="email"
                className="glass-input text-xs"
                placeholder="your.email@gmail.com"
                value={customGoogleEmail}
                onChange={e => setCustomGoogleEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-[11px] text-glass-dim mb-1">Full Name (Optional)</label>
              <input
                type="text"
                className="glass-input text-xs"
                placeholder="e.g. Suresh Patel"
                value={customGoogleName}
                onChange={e => setCustomGoogleName(e.target.value)}
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <GlowButton type="button" variant="outline" size="sm" onClick={() => setShowGoogleModal(false)}>
                Cancel
              </GlowButton>
              <GlowButton type="submit" size="sm" icon={<ArrowRight size={14} />}>
                Continue with Google
              </GlowButton>
            </div>
          </form>
        </div>
      </Modal>

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
