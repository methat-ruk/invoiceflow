import axios from 'axios'

const DEFAULT_API_ORIGIN = 'http://localhost:4000'

const isAbsoluteHttpUrl = (value: string) => /^https?:\/\//.test(value)

const getFrontendOrigin = () => {
  if (typeof window === 'undefined') return null
  return window.location.origin
}

const normalizeApiBaseUrl = (value?: string) => {
  const rawValue = (value ?? DEFAULT_API_ORIGIN).trim()

  if (!isAbsoluteHttpUrl(rawValue)) {
    throw new Error(
      'NEXT_PUBLIC_API_URL must be an absolute URL starting with http:// or https://',
    )
  }

  const normalized = new URL(rawValue)
  const frontendOrigin = getFrontendOrigin()

  if (frontendOrigin && normalized.origin === frontendOrigin) {
    throw new Error(
      'NEXT_PUBLIC_API_URL must point to the backend domain, not the frontend Vercel domain',
    )
  }

  normalized.pathname = normalized.pathname.replace(/\/$/, '')

  if (!normalized.pathname || normalized.pathname === '/') {
    normalized.pathname = '/api'
  } else if (!normalized.pathname.endsWith('/api')) {
    normalized.pathname = `${normalized.pathname}/api`
  }

  return normalized.toString().replace(/\/$/, '')
}

const apiBaseUrl = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL)

if (
  typeof window !== 'undefined' &&
  new URL(apiBaseUrl).origin === window.location.origin
) {
  console.warn(
    '[api] Auth/API requests are targeting the frontend domain. Check NEXT_PUBLIC_API_URL.',
  )
}

const api = axios.create({
  baseURL: apiBaseUrl,
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${apiBaseUrl}${normalizedPath}`
}

export default api
