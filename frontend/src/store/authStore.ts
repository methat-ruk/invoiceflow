import { create } from 'zustand'
import type { User } from '@/types'

const TOKEN_STORAGE_KEY = 'token'
const USER_STORAGE_KEY = 'user'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  restoreSession: (token: string, user: User) => void
  logout: () => void
}

const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
}

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0`
}

const setSession = (
  set: (partial: Partial<AuthStore>) => void,
  token: string,
  user: User,
  persist: boolean,
) => {
  if (persist) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    setCookie('token', token)
  }

  set({ token, user, isAuthenticated: true })
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (token, user) => {
    setSession(set, token, user, true)
  },

  restoreSession: (token, user) => {
    setSession(set, token, user, false)
  },

  logout: () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    deleteCookie('token')
    set({ token: null, user: null, isAuthenticated: false })
  },
}))
