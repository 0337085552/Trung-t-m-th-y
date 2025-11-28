import React, { createContext, useContext, useEffect, useState } from 'react'
import { STORAGE_KEYS, apiPost } from './utils'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    if (raw) {
      try {
        setUser(JSON.parse(raw))
      } catch {
        // ignore
      }
    }
  }, [])

  const login = async (identifier, password) => {
    try {
      const res = await apiPost('/auth/login', { identifier, password })
      if (!res.success) {
        return { success: false, message: res.message || 'Đăng nhập thất bại.' }
      }
      if (res.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, res.token)
      }
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(res.user))
      setUser(res.user)
      return { success: true, user: res.user }
    } catch (err) {
      return { success: false, message: err.message || 'Không thể kết nối tới server.' }
    }
  }

  const register = async ({ fullName, email, phone, password }) => {
    try {
      const res = await apiPost('/auth/register', { fullName, email, phone, password })
      return { success: res.success, message: res.message }
    } catch (err) {
      return { success: false, message: err.message || 'Không thể kết nối tới server.' }
    }
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}