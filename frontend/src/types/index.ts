export interface User {
  id: string
  email: string
  name: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface ApiError {
  message: string
  error?: string
  statusCode?: number
}

export interface Client {
  id: string
  name: string
  email: string
  phone?: string | null
  address?: string | null
  userId: string
  createdAt: string
  updatedAt: string
}
