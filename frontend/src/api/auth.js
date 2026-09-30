import { apiRequest } from './client'

export function register({ name, email, password, grade }) {
  return apiRequest('/api/v1/auth/register', {
    method: 'POST',
    body: { name, email, password, grade: grade || null },
  })
}

export function verifyEmail({ email, code }) {
  return apiRequest('/api/v1/auth/verify-email', {
    method: 'POST',
    body: { email, code },
  })
}

export function resendOtp({ email }) {
  return apiRequest('/api/v1/auth/resend-otp', {
    method: 'POST',
    body: { email },
  })
}

export function login({ email, password }) {
  return apiRequest('/api/v1/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

export function forgotPassword({ email }) {
  return apiRequest('/api/v1/auth/forgot-password', {
    method: 'POST',
    body: { email },
  })
}

export function resetPassword({ email, code, newPassword }) {
  return apiRequest('/api/v1/auth/reset-password', {
    method: 'POST',
    body: { email, code, new_password: newPassword },
  })
}

export function fetchCurrentUser() {
  return apiRequest('/api/v1/auth/me', { auth: true })
}
