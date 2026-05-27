import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const ResetPassword = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleReset = async () => {
    if (password.length < 6) { setError('Min 6 characters'); return }
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    setLoading(true)
    setError('')
    try {
      const { error: err } = await supabase.auth.updateUser({ password })
      if (err) throw err
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err: any) {
      setError(err.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
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
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 12px' }}>
            Password Reset!
          </h2>
          <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '24px' }}>
            Password updated successfully. Redirecting to login...
          </p>
        </div>
      </div>
    )
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    border: '1.5px solid #e5e7eb', borderRadius: '10px',
    fontSize: '14px', outline: 'none',
    boxSizing: 'border-box' as const
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
            Reset Password
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '15px' }}>
            Enter your new password
          </p>
        </div>

        <div style={{
          backgroundColor: 'white', borderRadius: '24px',
          padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
                New Password
              </label>
              <input
                type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 6 characters" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#4F46E5'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
                Confirm Password
              </label>
              <input
                type="password" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                onKeyDown={e => e.key === 'Enter' && handleReset()}
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
              boxShadow: loading ? 'none' : '0 4px 15px rgba(79,70,229,0.4)'
            }}
          >
            {loading ? '⟳ Resetting...' : '🔒 Reset Password'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
