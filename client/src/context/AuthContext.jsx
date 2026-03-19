/**
 * @file AuthContext.jsx
 * @description Global authentication context provider.
 *              Manages JWT token in localStorage, user state, login and logout.
 *              Automatically attaches Bearer token to all outgoing axios requests.
 *              Validates existing token on app mount to restore session.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('motek_token'))
  const [isLoading, setIsLoading] = useState(true)

  // Attach or remove Authorization header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // On app mount — validate existing token with backend
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsLoading(false)
        return
      }
      try {
        const { data } = await axios.get('/api/auth/me')
        setUser(data.user)
      } catch {
        // Token is invalid or expired — clear everything
        localStorage.removeItem('motek_token')
        setToken(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    validateToken()
  }, [])

  // Login — call backend, store token, update state
  const login = useCallback(async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password })
    const { token: newToken, user: newUser } = data
    localStorage.setItem('motek_token', newToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    setToken(newToken)
    setUser(newUser)
    return newUser
  }, [])

  // Logout — clear token and user state
  const logout = useCallback(() => {
    localStorage.removeItem('motek_token')
    delete axios.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
