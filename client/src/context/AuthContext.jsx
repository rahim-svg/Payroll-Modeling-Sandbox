/**
 * @file AuthContext.jsx
 * @description Global authentication context.
 *              Manages JWT token in localStorage, user state, login and logout.
 *              Automatically attaches Authorization header to all axios requests.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('motek_token'))
  const [isLoading, setIsLoading] = useState(true)

  // Attach token to every outgoing axios request
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // On mount — validate existing token against backend
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
    const { token: newToken, user: newUser } = data
    localStorage.setItem('motek_token', newToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    setToken(newToken)
    setUser(newUser)
    return newUser
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
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
