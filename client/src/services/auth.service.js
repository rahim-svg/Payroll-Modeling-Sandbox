/**
 * @file auth.service.js
 * @description Authentication API service.
 *              Handles login and current user fetching.
 *              All other auth state management lives in AuthContext.
 */
import axios from 'axios'

export const authService = {
  /**
   * Login with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{token: string, user: object}>}
   */
  login: async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password })
    return data
  },

  /**
   * Fetch the currently authenticated user
   * @returns {Promise<{user: object}>}
   */
  getMe: async () => {
    const { data } = await axios.get('/api/auth/me')
    return data
  },
}
