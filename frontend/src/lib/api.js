const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

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

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
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
