const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const TOKEN_KEY = 'conceptflow.token'

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch {
    /* storage unavailable — ignore */
  }
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiRequest(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {}
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  if (auth) {
    const token = getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Unable to reach the server. Please try again.', 0)
  }

  let data = null
  const text = await response.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = null
    }
  }

  if (!response.ok) {
    const message = extractErrorMessage(data) ?? 'Something went wrong.'
    throw new ApiError(message, response.status)
  }

  return data
}

function extractErrorMessage(data) {
  if (!data) {
    return null
  }
  if (typeof data.detail === 'string') {
    return data.detail
  }
  // FastAPI validation errors: detail is an array of {msg, loc}
  if (Array.isArray(data.detail) && data.detail.length > 0) {
    const first = data.detail[0]
    if (first?.msg) {
      return first.msg.replace(/^Value error,\s*/i, '')
    }
  }
  if (typeof data.message === 'string') {
    return data.message
  }
  return null
}
