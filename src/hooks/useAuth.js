import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { supabase } from '../services/supabase'
import { setSession, clearSession } from '../store/authSlice'

export function useAuth() {
  const dispatch = useDispatch()
  const { user, session } = useSelector((state) => state.auth)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setSession(session))
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session))
    })

    return () => subscription.unsubscribe()
  }, [dispatch])

  const signInWithLinkedIn = () =>
    supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })

  const signOut = () => {
    supabase.auth.signOut()
    dispatch(clearSession())
  }

  return { user, session, signInWithLinkedIn, signOut }
}
