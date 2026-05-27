import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const Signup = () => {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/')
    })
  }, [])

  const handleSignUp = async () => {
    if (!fullName.trim()) { setError('Full name required'); return }
    if (!email.trim()) { setError('Email required'); return }
    if (password.length < 6) { setError('Password min 6 characters'); return }
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    setLoading(true)
    setError('')
    try {
      const { data, error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: fullName.trim() } }
      })
      if (err) throw err
      if (data.user) setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
    setError('')
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      })
      if (err) throw err
    } catch (err: any) {
      setError(err.message || 'Google signup failed')
      setGoogleLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    border: '1.5px solid #e5e7eb', borderRadius: '10px',
    fontSize: '14px', outline: 'none',
    boxSizing: 'border-box' as const, fontFamily: 'inherit'
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white', borderRadius: '24px',
          padding: '48px 32px', maxWidth: '420px',
          width: '100%', textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📧</div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 12px' }}>
            Check Your Email!
          </h2>
          <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: '1.6', marginBottom: '8px' }}>
            Verification link sent to
          </p>
          <p style={{ color: '#4F46E5', fontWeight: '700', fontSize: '16px', marginBottom: '24px' }}>
            {email}
          </p>
          <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '24px', lineHeight: '1.5' }}>
            Click the link to activate your account. Check spam folder if not found.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              color: 'white', border: 'none',
              borderRadius: '12px', fontSize: '15px',
              fontWeight: '700', cursor: 'pointer'
            }}
          >Go to Login →</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px',
            backgroundColor: 'white', borderRadius: '16px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 12px',
            fontSize: '22px', fontWeight: '900', color: '#4F46E5',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }}>R</div>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '800', margin: '0 0 4px' }}>
            Create Account
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '15px' }}>
            Start building your perfect resume
          </p>
        </div>

        <div style={{
          backgroundColor: 'white', borderRadius: '24px',
          padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
        }}>

          {/* Google */}
          <button
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            style={{
              width: '100%', padding: '13px',
              border: '1.5px solid #e5e7eb', borderRadius: '12px',
              backgroundColor: 'white', fontSize: '15px',
              fontWeight: '600', cursor: googleLoading ? 'wait' : 'pointer',
              marginBottom: '20px', display: 'flex',
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
                Sign Up with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '12px', marginBottom: '20px'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
            <span style={{ fontSize: '13px', color: '#9ca3af' }}>or sign up with email</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Full Name</label>
              <input
                type="text" value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Rahul Sharma" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#4F46E5'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Email Address</label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="rahul@gmail.com" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#4F46E5'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Password</label>
              <input
                type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 6 characters" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#4F46E5'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Confirm Password</label>
              <input
                type="password" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                onKeyDown={e => e.key === 'Enter' && handleSignUp()}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#4F46E5'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2', border: '1px solid #fca5a5',
              borderRadius: '10px', padding: '10px 14px',
              marginBottom: '16px', fontSize: '13px', color: '#dc2626'
            }}>❌ {error}</div>
          )}

          <button
            onClick={handleSignUp}
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
              marginBottom: '16px',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(79,70,229,0.4)'
            }}
          >
            {loading ? '⟳ Creating account...' : 'Create Account →'}
          </button>

          <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginBottom: '16px', lineHeight: '1.5' }}>
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', margin: 0 }}>
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              style={{ color: '#4F46E5', fontWeight: '700', cursor: 'pointer' }}
            >Sign In</span>
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

export default Signup
