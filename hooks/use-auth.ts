"use client"

import React, { useState, useEffect, createContext, useContext } from "react"
import type { Admin } from "@/shared/types"

interface AuthContextType {
  user: Admin | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("admin_token")
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.data)
      } else {
        localStorage.removeItem("admin_token")
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("admin_token")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Đăng nhập thất bại")
      }

      localStorage.setItem("admin_token", data.data.token)
      setUser(data.data.user)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem("admin_token")
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("admin_token")
      setUser(null)
      window.location.href = "/admin/login"
    }
  }

  const refreshUser = async () => {
    await checkAuth()
  }

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  }

  return React.createElement(AuthContext.Provider, { value }, children)
}
