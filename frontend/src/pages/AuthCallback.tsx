import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        if (session?.user) {
          localStorage.setItem('userData', JSON.stringify({
            id: session.user.id,
            email: session.user.email,
            fullName: session.user.user_metadata?.full_name ||
                      session.user.user_metadata?.name || ''
          }))
          localStorage.setItem('authToken', session.access_token)
          navigate('/')
        } else {
          navigate('/login')
        }
      } catch {
        navigate('/login')
      }
    }
    handleCallback()
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', color: 'white'
    }}>
      <div style={{
        width: '56px', height: '56px',
        backgroundColor: 'white', borderRadius: '16px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', marginBottom: '20px',
        fontSize: '22px', fontWeight: '900', color: '#4F46E5'
      }}>R</div>
      <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
        Completing sign in...
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
        Please wait a moment
      </p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{
        marginTop: '20px', fontSize: '32px',
        animation: 'spin 1s linear infinite'
      }}>⟳</div>
    </div>
  )
}

export default AuthCallback
