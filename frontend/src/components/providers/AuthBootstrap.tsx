'use client'

import { useEffect } from 'react'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import type { User } from '@/types'

const TOKEN_STORAGE_KEY = 'token'
const USER_STORAGE_KEY = 'user'

const parseStoredUser = (value: string | null): User | null => {
  if (!value) return null

  try {
    return JSON.parse(value) as User
  } catch {
    return null
  }
}

const AuthBootstrap = ({ children }: { children: React.ReactNode }) => {
  const { token, user, restoreSession, logout } = useAuthStore()

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY)
    const storedUser = parseStoredUser(localStorage.getItem(USER_STORAGE_KEY))

    if (!storedToken) {
      if (token || user) logout()
      return
    }

    if (storedUser && (!token || !user)) {
      restoreSession(storedToken, storedUser)
      return
    }

    if (storedToken && !storedUser) {
      authService
        .me()
        .then((me) => {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(me))
          restoreSession(storedToken, me)
        })
        .catch(() => logout())
    }
  }, [logout, restoreSession, token, user])

  return children
}

export default AuthBootstrap
