"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

export interface AssessmentResult {
  date: string
  primaryArchetype: string
  secondaryArchetype: string
  dimensions: Array<{
    dimension: string
    score: number
  }>
}

export interface User {
  id: string
  name: string | null
  displayName: string
  email: string
  profileImage: string | null
  academicLevel: string | null
  institution: string | null
  fieldOfStudy: string | null
  createdAt: Date
  assessmentResults: AssessmentResult[]
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  saveAssessmentResult: (result: AssessmentResult) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Initialize users array in localStorage if it doesn't exist
  useEffect(() => {
    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify([]))
    }
  }, [])

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
      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      // Check if user exists in localStorage (simulating a database)
      const storedUsers = localStorage.getItem("users") || "[]"
      const users = JSON.parse(storedUsers)
      const foundUser = users.find((u: any) => u.email === email)

      if (!foundUser) {
        throw new Error("No account found with this email address")
      }

      if (foundUser.password !== password) {
        throw new Error("Incorrect password")
      }

      // Remove password before storing in state
      const { password: _, ...userWithoutPassword } = foundUser

      // Ensure user has assessmentResults array
      if (!userWithoutPassword.assessmentResults) {
        userWithoutPassword.assessmentResults = []
      }

      // Ensure user has displayName
      if (!userWithoutPassword.displayName) {
        userWithoutPassword.displayName = userWithoutPassword.name
          ? userWithoutPassword.name[0].toUpperCase()
          : userWithoutPassword.email[0].toUpperCase()

        // Update in "database"
        const updatedUsers = users.map((u: any) =>
          u.id === foundUser.id ? { ...u, displayName: userWithoutPassword.displayName } : u,
        )
        localStorage.setItem("users", JSON.stringify(updatedUsers))
      }

      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
      return Promise.reject(err) // Propagate error to component
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, this would be an API call to create a user
      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long")
      }

      // Check if user already exists
      const storedUsers = localStorage.getItem("users") || "[]"
      const users = JSON.parse(storedUsers)

      if (users.some((u: any) => u.email === email)) {
        throw new Error("An account with this email already exists")
      }

      // Initialize display name with first letter of email
      const displayName = email[0].toUpperCase()

      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        password, // In a real app, this would be hashed
        name: null,
        displayName,
        profileImage: null,
        academicLevel: null,
        institution: null,
        fieldOfStudy: null,
        createdAt: new Date(),
        assessmentResults: [],
      }

      // Save to "database"
      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      // Remove password before storing in state
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))

      router.push("/profile/setup")
    } catch (err: any) {
      setError(err.message)
      return Promise.reject(err) // Propagate error to component
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
      return Promise.reject(err)
    } finally {
      setLoading(false)
    }
  }

  const saveAssessmentResult = async (result: AssessmentResult) => {
    if (!user) {
      return Promise.reject(new Error("No user logged in"))
    }

    try {
      // Add the result to the user's assessment results
      const updatedResults = [...(user.assessmentResults || []), result]

      // Update user with new results
      const updatedUser = {
        ...user,
        assessmentResults: updatedResults,
      }

      // Save to state and localStorage
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))

      // Update in "database"
      const storedUsers = localStorage.getItem("users") || "[]"
      const users = JSON.parse(storedUsers)
      const updatedUsers = users.map((u: any) => (u.id === user.id ? { ...u, assessmentResults: updatedResults } : u))
      localStorage.setItem("users", JSON.stringify(updatedUsers))

      return Promise.resolve()
    } catch (err: any) {
      console.error("Failed to save assessment result:", err)
      return Promise.reject(err)
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
    saveAssessmentResult,
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
