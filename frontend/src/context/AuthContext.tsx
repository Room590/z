import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/client'

type User = { id: string; name: string; email: string; role: 'user' | 'seller' | 'admin' }

type AuthContextProps = {
  user?: User
  token?: string
  login: (email: string, password: string) => Promise<void>
  register: (payload: { name: string; email: string; password: string; role: 'user' | 'seller' }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>()
  const [token, setToken] = useState<string | undefined>()

  useEffect(() => {
    const stored = localStorage.getItem('auth')
    if (stored) {
      const parsed = JSON.parse(stored)
      setUser(parsed.user)
      setToken(parsed.token)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    setUser(res.data.user)
    setToken(res.data.token)
    localStorage.setItem('auth', JSON.stringify(res.data))
  }

  const register = async (payload: { name: string; email: string; password: string; role: 'user' | 'seller' }) => {
    const res = await api.post('/auth/register', payload)
    setUser(res.data.user)
    setToken(res.data.token)
    localStorage.setItem('auth', JSON.stringify(res.data))
  }

  const logout = () => {
    setUser(undefined)
    setToken(undefined)
    localStorage.removeItem('auth')
  }

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`
    }
  }, [token])

  return <AuthContext.Provider value={{ user, token, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('AuthContext missing')
  return ctx
}
