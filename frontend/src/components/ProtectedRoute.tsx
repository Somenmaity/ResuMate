import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setAuthenticated(true)
      } else {
        navigate('/login')
      }
      setLoading(false)
    }
    
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          navigate('/login')
        } else {
          setAuthenticated(true)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{
          width: '56px', height: '56px',
          backgroundColor: 'white',
          borderRadius: '16px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          fontSize: '22px', fontWeight: '900',
          color: '#4F46E5',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }}>R</div>
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
          Loading...
        </h2>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div style={{
          fontSize: '28px',
          animation: 'spin 1s linear infinite',
          marginTop: '12px'
        }}>⟳</div>
      </div>
    )
  }

  if (!authenticated) return null

  return <>{children}</>
}

export default ProtectedRoute
