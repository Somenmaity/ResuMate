import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Both fields are required'); return }
    setLoading(true); setError('')

    try {
      const res  = await fetch(`${BASE_URL}/api/admin/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminEmail', data.admin.email)
        navigate('/admin')
      } else {
        setError(data.error || 'Invalid credentials')
      }
    } catch {
      setError('Server not reachable. Make sure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', backgroundColor: '#0f172a',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        width: '100%', maxWidth: '420px', padding: '48px 40px',
        backgroundColor: '#1e293b', borderRadius: '20px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        border: '1px solid #334155',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '56px', height: '56px', backgroundColor: '#6366f1',
            borderRadius: '16px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px',
            fontSize: '22px', fontWeight: '900', color: 'white',
            boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
          }}>R</div>
          <h1 style={{ color: 'white', fontSize: '22px', fontWeight: '800', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
            Admin Panel
          </h1>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>ResuMate AI — Restricted Access</p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Admin Email
            </label>
            <input
              type="email" value={email} onChange={e => { setEmail(e.target.value); setError('') }}
              placeholder="Enter admin email"
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px',
                border: `1.5px solid ${error ? '#ef4444' : '#334155'}`,
                backgroundColor: '#0f172a', color: 'white', fontSize: '14px',
                outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'} value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '12px 48px 12px 16px', borderRadius: '12px',
                  border: `1.5px solid ${error ? '#ef4444' : '#334155'}`,
                  backgroundColor: '#0f172a', color: 'white', fontSize: '14px',
                  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                }}
              />
              <button type="button" onClick={() => setShowPass(p => !p)} style={{
                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', lineHeight: 1,
              }}>
                {showPass
                  ? <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  : <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                }
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#450a0a', border: '1px solid #991b1b', borderRadius: '10px',
              padding: '10px 14px', marginBottom: '16px',
              fontSize: '13px', color: '#fca5a5', fontWeight: '600',
            }}>{error}</div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
            background: loading ? '#334155' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white', fontSize: '14px', fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: '0.05em', textTransform: 'uppercase',
            boxShadow: loading ? 'none' : '0 8px 24px rgba(99,102,241,0.35)',
            transition: 'all 0.2s',
          }}>
            {loading ? 'Signing in…' : 'Sign In to Admin'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '12px', color: '#475569' }}>
          Not an admin?{' '}
          <span
            onClick={() => navigate('/')}
            style={{ color: '#6366f1', cursor: 'pointer', fontWeight: '700' }}
          >
            Go to app
          </span>
        </p>
      </div>
    </div>
  )
}

export default AdminLogin
