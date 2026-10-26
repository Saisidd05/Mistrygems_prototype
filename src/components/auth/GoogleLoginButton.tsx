import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Google Sign-In button using Google Identity Services.
 * Renders the official Google button that opens the real Google account chooser.
 */
export default function GoogleLoginButton({ accountType }: { accountType: 'workshop' | 'industry' }) {
  const navigate = useNavigate()
  const { loginWithGoogle } = useAuth()
  const containerRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

  // Check if a real client ID is configured
  const isConfigured = Boolean(clientId && !clientId.startsWith('YOUR_'))

  useEffect(() => {
    if (!isConfigured || !clientId) return

    const renderButton = () => {
      if (!window.google?.accounts?.id || !containerRef.current) return
      if (initializedRef.current) return
      initializedRef.current = true

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: { credential: string }) => {
          const result = await loginWithGoogle(response.credential, accountType)
          if (!result.success) {
            console.error('Google sign-in failed:', result.error)
          } else if (result.isNewUser && result.googleDetails) {
            sessionStorage.setItem('mg_google_temp', JSON.stringify(result.googleDetails))
            navigate('/complete-profile')
          } else {
            navigate(result.redirectTo || '/')
          }
        },
      })

      window.google.accounts.id.renderButton(containerRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: 384,
      })
    }

    // Load Google Identity Services script if not already loaded
    if (window.google?.accounts?.id) {
      renderButton()
    } else {
      const scriptId = 'google-gsi-script'
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script')
        script.id = scriptId
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true
        script.onload = renderButton
        document.head.appendChild(script)
      } else {
        // Script tag exists but hasn't loaded yet — poll for it
        const interval = setInterval(() => {
          if (window.google?.accounts?.id) {
            clearInterval(interval)
            renderButton()
          }
        }, 200)
        return () => clearInterval(interval)
      }
    }

    return () => {
      initializedRef.current = false
    }
  }, [clientId, isConfigured, accountType, loginWithGoogle, navigate])

  if (!isConfigured) {
    return (
      <p className="text-center text-xs text-glass-dim py-2">
        Google Sign-In is not configured. Set <code>VITE_GOOGLE_CLIENT_ID</code> in your <code>.env</code> file.
      </p>
    )
  }

  return <div ref={containerRef} className="flex justify-center" />
}
