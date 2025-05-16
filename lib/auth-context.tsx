"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

export interface User {
  id: string
  name: string | null
  email: string
  profileImage: string | null
  academicLevel: string | null
  institution: string | null
  fieldOfStudy: string | null
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would be an API call to validate the session
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (err) {
        console.error("Authentication error:", err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, this would be an API call to authenticate
      // Simulating authentication for demo purposes
      if (email && password) {
        // Check if user exists in localStorage (simulating a database)
        const storedUsers = localStorage.getItem("users") || "[]"
        const users = JSON.parse(storedUsers)
        const foundUser = users.find((u: any) => u.email === email)

        if (foundUser && foundUser.password === password) {
          // Remove password before storing in state
          const { password, ...userWithoutPassword } = foundUser
          setUser(userWithoutPassword)
          localStorage.setItem("user", JSON.stringify(userWithoutPassword))
          router.push("/dashboard")
        } else {
          throw new Error("Invalid email or password")
        }
      } else {
        throw new Error("Email and password are required")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, this would be an API call to create a user
      // Simulating user creation for demo purposes
      if (email && password) {
        // Check if user already exists
        const storedUsers = localStorage.getItem("users") || "[]"
        const users = JSON.parse(storedUsers)

        if (users.some((u: any) => u.email === email)) {
          throw new Error("User with this email already exists")
        }

        // Create new user
        const newUser = {
          id: `user-${Date.now()}`,
          email,
          password, // In a real app, this would be hashed
          name: null,
          profileImage: null,
          academicLevel: null,
          institution: null,
          fieldOfStudy: null,
          createdAt: new Date(),
        }

        // Save to "database"
        users.push(newUser)
        localStorage.setItem("users", JSON.stringify(users))

        // Remove password before storing in state
        const { password: _, ...userWithoutPassword } = newUser
        setUser(userWithoutPassword)
        localStorage.setItem("user", JSON.stringify(userWithoutPassword))

        router.push("/profile/setup")
      } else {
        throw new Error("Email and password are required")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  const updateProfile = async (data: Partial<User>) => {
    setLoading(true)
    setError(null)

    try {
      if (user) {
        // Update user in state
        const updatedUser = { ...user, ...data }
        setUser(updatedUser)

        // Update in localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser))

        // Update in "database"
        const storedUsers = localStorage.getItem("users") || "[]"
        const users = JSON.parse(storedUsers)
        const updatedUsers = users.map((u: any) => (u.id === user.id ? { ...u, ...data } : u))
        localStorage.setItem("users", JSON.stringify(updatedUsers))
      } else {
        throw new Error("No user logged in")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
