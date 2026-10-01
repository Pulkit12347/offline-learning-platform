import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchCurrentUser } from '../api/auth'
import { getToken, setToken } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      if (!getToken()) {
        setInitializing(false)
        return
      }
      try {
        const currentUser = await fetchCurrentUser()
        if (!cancelled) {
          setUser(currentUser)
        }
      } catch {
        // Token invalid/expired — clear it.
        setToken(null)
      } finally {
        if (!cancelled) {
          setInitializing(false)
        }
      }
    }

    bootstrap()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback((token, userData) => {
    setToken(token)
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      initializing,
      isAuthenticated: Boolean(user),
      isAdmin: Boolean(user?.is_admin),
      login,
      logout,
    }),
    [user, initializing, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
