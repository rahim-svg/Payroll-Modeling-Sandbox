/**
 * @file auth.service.js
 * @description Auth API calls — login and token validation.
 */
import axios from 'axios'

export const authService = {
  login: (email, password) => axios.post('/api/auth/login', { email, password }),
  getMe: () => axios.get('/api/auth/me'),
}
