"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "patient" | "doctor"
  phone?: string
  specialization?: string
  bio?: string
  experience?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, role: string) => boolean
  register: (userData: any) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for stored auth data on mount
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = (email: string, password: string, role: string): boolean => {
    // Mock authentication - in real app, this would call an API
    const mockUsers = [
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "patient@demo.com",
        role: "patient" as const,
        phone: "+1234567890",
      },
      {
        id: "2",
        firstName: "Dr. Sarah",
        lastName: "Smith",
        email: "doctor@demo.com",
        role: "doctor" as const,
        phone: "+1234567891",
        specialization: "Cardiology",
        bio: "Experienced cardiologist with 10+ years of practice",
        experience: "10",
      },
    ]

    const foundUser = mockUsers.find(
      (u) => u.email === email && u.role === role && password === "password", // Mock password check
    )

    if (foundUser) {
      const token = "mock-jwt-token-" + Date.now()
      localStorage.setItem("user", JSON.stringify(foundUser))
      localStorage.setItem("token", token)
      setUser(foundUser)
      setIsAuthenticated(true)
      return true
    }

    return false
  }

  const register = (userData: any): boolean => {
    // Mock registration - in real app, this would call an API
    const newUser: User = {
      id: Date.now().toString(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
      phone: userData.phone,
      specialization: userData.specialization,
      bio: userData.bio,
      experience: userData.experience,
    }

    // Store in localStorage (mock database)
    const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    existingUsers.push(newUser)
    localStorage.setItem("registeredUsers", JSON.stringify(existingUsers))

    return true
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
