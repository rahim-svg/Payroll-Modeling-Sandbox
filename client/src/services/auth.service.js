/**
 * @file auth.service.js
 * @description Authentication API calls.
 *              Handles login and token validation against the Express backend.
 */
import axios from 'axios'

export const authService = {
  // Authenticate user and return JWT token
  login: async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password })
    return data
  },

  // Validate existing token and return user info
  me: async () => {
    const { data } = await axios.get('/api/auth/me')
    return data
  },
}
