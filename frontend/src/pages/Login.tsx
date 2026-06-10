import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [linkedinLoading, setLinkedinLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/')
    })
  }, [])

  const handleSignIn = async () => {
    if (!email.trim()) { setError('Email required'); return }
    if (!password.trim()) { setError('Password required'); return }
    setLoading(true)
    setError('')
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      })
      if (err) throw err
      if (data.user) navigate('/')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError('')
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      })
      if (err) throw err
    } catch (err: any) {
      setError(err.message || 'Google login failed')
      setGoogleLoading(false)
    }
  }

  const handleLinkedInLogin = async () => {
    setLinkedinLoading(true)
    setError('')
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      })
      if (err) throw err
    } catch (err: any) {
      setError(err.message || 'LinkedIn login failed')
      setLinkedinLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px',
            backgroundColor: 'white', borderRadius: '16px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 12px',
            fontSize: '22px', fontWeight: '900', color: '#4F46E5',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }}>R</div>
          <h1 style={{
            color: 'white', fontSize: '28px',
            fontWeight: '800', margin: '0 0 4px'
          }}>Welcome Back!</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '15px' }}>
            Sign in to ResuMate AI
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: 'white', borderRadius: '24px',
          padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
        }}>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            style={{
              width: '100%', padding: '13px',
              border: '1.5px solid #e5e7eb', borderRadius: '12px',
              backgroundColor: 'white', fontSize: '15px',
              fontWeight: '600', cursor: googleLoading ? 'wait' : 'pointer',
              marginBottom: '10px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: '10px'
            }}
          >
            {googleLoading ? '⟳ Connecting...' : (
              <>
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.3 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5c11 0 20.5-8 20.5-20.5 0-1.4-.1-2.7-.4-4z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.4 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4.5 24 4.5c-7.8 0-14.5 4.3-17.7 10.2z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.5 26.8 36.5 24 36.5c-5.2 0-9.6-3.5-11.2-8.3l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.5l6.2 5.2C40.8 35.3 44 30 44 24c0-1.4-.1-2.7-.4-4z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* LinkedIn */}
          <button
            onClick={handleLinkedInLogin}
            disabled={linkedinLoading}
            style={{
              width: '100%', padding: '13px',
              border: '1.5px solid #e5e7eb', borderRadius: '12px',
              backgroundColor: 'white', fontSize: '15px',
              fontWeight: '600', cursor: linkedinLoading ? 'wait' : 'pointer',
              marginBottom: '20px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: '10px'
            }}
          >
            {linkedinLoading ? '⟳ Connecting...' : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Continue with LinkedIn
              </>
            )}
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '12px', marginBottom: '20px'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
            <span style={{ fontSize: '13px', color: '#9ca3af' }}>or sign in with email</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{
              fontSize: '13px', fontWeight: '600',
              color: '#374151', display: 'block', marginBottom: '6px'
            }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="rahul@gmail.com"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#4F46E5'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{
              fontSize: '13px', fontWeight: '600',
              color: '#374151', display: 'block', marginBottom: '6px'
            }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                onKeyDown={e => e.key === 'Enter' && handleSignIn()}
                style={{ ...inputStyle, paddingRight: '44px' }}
                onFocus={e => e.target.style.borderColor = '#4F46E5'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', padding: 0,
                  color: '#9ca3af', display: 'flex', alignItems: 'center'
                }}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <span
              onClick={() => navigate('/forgot-password')}
              style={{
                color: '#4F46E5', fontSize: '13px',
                fontWeight: '600', cursor: 'pointer'
              }}
            >Forgot password?</span>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '10px', padding: '10px 14px',
              marginBottom: '16px', fontSize: '13px', color: '#dc2626'
            }}>❌ {error}</div>
          )}

          {/* Sign In Button */}
          <button
            onClick={handleSignIn}
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading
                ? '#9ca3af'
                : 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              color: 'white', border: 'none',
              borderRadius: '12px', fontSize: '15px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '20px',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(79,70,229,0.4)'
            }}
          >
            {loading ? '⟳ Signing in...' : 'Sign In →'}
          </button>

          {/* Signup link */}
          <p style={{
            textAlign: 'center', fontSize: '14px',
            color: '#6b7280', margin: 0
          }}>
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/signup')}
              style={{ color: '#4F46E5', fontWeight: '700', cursor: 'pointer' }}
            >Create Free Account</span>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          <span
            onClick={() => navigate('/')}
            style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', cursor: 'pointer' }}
          >← Back to Home</span>
        </p>
      </div>
    </div>
  )
}

export default Login
