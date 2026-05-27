import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        localStorage.setItem('userData', JSON.stringify({
          id: session.user.id,
          email: session.user.email,
          fullName: session.user.user_metadata?.full_name || 
                    session.user.user_metadata?.name || ''
        }))
        localStorage.setItem('authToken', session.access_token)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          localStorage.setItem('userData', JSON.stringify({
            id: session.user.id,
            email: session.user.email,
            fullName: session.user.user_metadata?.full_name ||
                      session.user.user_metadata?.name || ''
          }))
          if (session.access_token) {
            localStorage.setItem('authToken', session.access_token)
          }
        } else {
          localStorage.removeItem('userData')
          localStorage.removeItem('authToken')
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('userData')
    localStorage.removeItem('authToken')
    setUser(null)
  }

  return { user, loading, signOut }
}
