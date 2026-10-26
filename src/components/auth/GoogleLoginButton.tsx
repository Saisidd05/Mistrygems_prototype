import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Google Sign‑In button using Google Identity Services.
 * The button is styled to match the app's premium glassmorphism theme.
 */
export default function GoogleLoginButton({ accountType }: { accountType: 'workshop' | 'industry' }) {
  const navigate = useNavigate();

  // Load Google Identity Services script once.
  useEffect(() => {
    const scriptId = 'google-identity-services';
    if (document.getElementById(scriptId)) return;
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  // Initialize the Google button once the script is ready.
  useEffect(() => {
    const initGoogleButton = () => {
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        callback: async (response: any) => {
          // Send the ID token to the backend for verification.
          try {
            const res = await fetch('/api/auth', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'google', credential: response.credential, accountType })
            });
            const data = await res.json();
            if (data.token) {
              // Store token (example: localStorage) and navigate to the dashboard.
              localStorage.setItem('authToken', data.token);
              navigate('/');
            } else if (data.isNewUser) {
              // New user – redirect to profile completion page.
              navigate('/complete-profile', { state: { googleData: data } });
            } else {
              console.error('Google sign‑in failed:', data.error);
            }
          } catch (e) {
            console.error('Google sign‑in request error:', e);
          }
        }
      });
      // Render the button into our container.
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: 240
        }
      );
    };
    // Wait for the script to load.
    if (window.google?.accounts?.id) {
      initGoogleButton();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          initGoogleButton();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [navigate]);

  return <div id="google-signin-button" className="mx-auto" />;
}
