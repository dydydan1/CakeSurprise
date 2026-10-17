const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const isUnauthorizedError = (error) => {
  return error instanceof ApiError && error.status === 401
}

const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  })

  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(data.message || 'Request failed', response.status)
  }

  return data
}

export const getCurrentAdmin = () => {
  return apiRequest('/admin/auth/me')
}

export const loginAdmin = (credentials) => {
  return apiRequest('/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
}

export const logoutAdmin = () => {
  return apiRequest('/admin/auth/logout', {
    method: 'POST'
  })
}

export const listGreetings = (filters = {}) => {
  const query = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== undefined && value !== null) {
      query.set(key, value)
    }
  })

  const queryString = query.toString()
  return apiRequest(`/admin/greetings${queryString ? `?${queryString}` : ''}`)
}

export const createGreeting = (greeting) => {
  return apiRequest('/admin/greetings', {
    method: 'POST',
    body: JSON.stringify(greeting)
  })
}

export const updateGreeting = (id, updates) => {
  return apiRequest(`/admin/greetings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  })
}

export const generateGreetingQr = (id) => {
  return apiRequest(`/admin/greetings/${id}/qr`, {
    method: 'POST'
  })
}

export const getPublicGreeting = (publicToken) => {
  return apiRequest(`/public/greetings/${publicToken}`)
}
