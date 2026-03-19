/**
 * @file AuthContext.jsx
 * @description Global auth context. Manages JWT token, user state, login and logout.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('motek_token'))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    else delete axios.defaults.headers.common['Authorization']
  }, [token])

  useEffect(() => {
    const validateToken = async () => {
      if (!token) { setIsLoading(false); return }
      try {
        const { data } = await axios.get('/api/auth/me')
        setUser(data.user)
      } catch {
        localStorage.removeItem('motek_token')
        setToken(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    validateToken()
  }, [])

  const login = useCallback(async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password })
    localStorage.setItem('motek_token', data.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setToken(data.token)
    setUser(data.user)
    return data.user
  }, [])

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
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
