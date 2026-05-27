import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleReset = async () => {
    if (!email.trim()) { setError('Please enter your email'); return }
    setLoading(true)
    setError('')
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: `${window.location.origin}/reset-password` }
      )
      if (err) throw err
      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
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
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📬</div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 12px' }}>Email Sent!</h2>
          <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '8px' }}>
            Password reset link sent to
          </p>
          <p style={{ color: '#4F46E5', fontWeight: '700', fontSize: '16px', marginBottom: '24px' }}>
            {email}
          </p>
          <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '28px', lineHeight: '1.5' }}>
            Click the link in email to reset password. Check spam if not found.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => setSent(false)}
              style={{
                padding: '10px 20px', border: '1.5px solid #e5e7eb',
                borderRadius: '10px', backgroundColor: 'white',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer'
              }}
            >Resend</button>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                color: 'white', border: 'none',
                borderRadius: '10px', fontSize: '14px',
                fontWeight: '700', cursor: 'pointer'
              }}
            >Back to Login</button>
          </div>
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
            Forgot Password?
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '15px' }}>
            We'll send you reset instructions
          </p>
        </div>

        <div style={{
          backgroundColor: 'white', borderRadius: '24px',
          padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            width: '64px', height: '64px',
            backgroundColor: '#eff6ff', borderRadius: '16px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 20px',
            fontSize: '28px'
          }}>🔒</div>

          <p style={{
            color: '#6b7280', fontSize: '14px',
            textAlign: 'center', marginBottom: '24px', lineHeight: '1.6'
          }}>
            Enter your email and we'll send a link to reset your password.
          </p>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              fontSize: '13px', fontWeight: '600',
              color: '#374151', display: 'block', marginBottom: '6px'
            }}>Email Address</label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="rahul@gmail.com"
              onKeyDown={e => e.key === 'Enter' && handleReset()}
              style={{
                width: '100%', padding: '12px 14px',
                border: '1.5px solid #e5e7eb', borderRadius: '10px',
                fontSize: '14px', outline: 'none',
                boxSizing: 'border-box' as const
              }}
              onFocus={e => e.target.style.borderColor = '#4F46E5'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2', border: '1px solid #fca5a5',
              borderRadius: '10px', padding: '10px 14px',
              marginBottom: '16px', fontSize: '13px', color: '#dc2626'
            }}>❌ {error}</div>
          )}

          <button
            onClick={handleReset}
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
            {loading ? '⟳ Sending...' : '📧 Send Reset Link'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', margin: 0 }}>
            Remember password?{' '}
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

export default ForgotPassword
