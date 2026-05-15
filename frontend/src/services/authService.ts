import api, { buildApiUrl } from '@/lib/api'
import type { AuthResponse } from '@/types'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  name: string
}

export const authService = {
  login: (data: LoginPayload) =>
    api.post<AuthResponse>(buildApiUrl('/auth/login'), data).then((r) => r.data),

  register: (data: RegisterPayload) =>
    api.post<AuthResponse>(buildApiUrl('/auth/register'), data).then((r) => r.data),

  me: () =>
    api.get<AuthResponse['user']>(buildApiUrl('/auth/me')).then((r) => r.data),
}
