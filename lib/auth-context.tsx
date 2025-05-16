"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { getSupabase, isInDemoMode, type Profile, type AssessmentResultRecord } from "./supabase"
import { useToast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"

export interface AssessmentResult {
  id: string
  date: Date
  dimensions: Array<{ dimension: string; score: number }>
  primaryArchetype: string
  secondaryArchetype: string
  archetypeScores: Array<{ id: string; score: number; match: number }>
}

export interface User {
  id: string
  name: string | null
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
  demoMode: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  saveAssessmentResult: (result: Omit<AssessmentResult, "id" | "date">) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  deleteAccount: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo user data for when Supabase is not available
const DEMO_USER: User = {
  id: "demo-user",
  name: "Demo User",
  email: "demo@example.com",
  profileImage: null,
  academicLevel: "undergraduate",
  institution: "Demo University",
  fieldOfStudy: "Computer Science",
  createdAt: new Date(),
  assessmentResults: [],
}

// Local storage keys
const LOCAL_STORAGE_USER_KEY = "revassess-demo-user"
const LOCAL_STORAGE_AUTH_KEY = "revassess-demo-auth"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [demoMode, setDemoMode] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Convert Supabase profile to our User type
  const profileToUser = async (profile: Profile): Promise<User> => {
    try {
      // Fetch assessment results for this user
      const supabase = getSupabase()
      const { data: assessmentData, error: assessmentError } = await supabase
        .from("assessment_results")
        .select("*")
        .eq("user_id", profile.user_id)
        .order("created_at", { ascending: false })

      if (assessmentError) {
        console.error("Error fetching assessment results:", assessmentError)
      }

      // Convert assessment results to our format
      const assessmentResults: AssessmentResult[] = (assessmentData || []).map((result: AssessmentResultRecord) => ({
        id: result.id,
        date: new Date(result.created_at),
        dimensions: result.dimensions,
        primaryArchetype: result.primary_archetype,
        secondaryArchetype: result.secondary_archetype,
        archetypeScores: result.archetype_scores,
      }))

      return {
        id: profile.user_id,
        name: profile.name,
        email: profile.email,
        profileImage: profile.profile_image,
        academicLevel: profile.academic_level,
        institution: profile.institution,
        fieldOfStudy: profile.field_of_study,
        createdAt: new Date(profile.created_at),
        assessmentResults,
      }
    } catch (error) {
      console.error("Error converting profile to user:", error)
      throw error
    }
  }

  // Load demo user from local storage
  const loadDemoUser = () => {
    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY)
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        // Convert date strings back to Date objects
        parsedUser.createdAt = new Date(parsedUser.createdAt)
        parsedUser.assessmentResults = parsedUser.assessmentResults.map((result: any) => ({
          ...result,
          date: new Date(result.date),
        }))
        return parsedUser
      }
    } catch (error) {
      console.error("Error loading demo user from local storage:", error)
    }
    return null
  }

  // Save demo user to local storage
  const saveDemoUser = (user: User) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user))
    } catch (error) {
      console.error("Error saving demo user to local storage:", error)
    }
  }

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)

        // Check if we're in demo mode
        const inDemoMode = isInDemoMode()
        setDemoMode(inDemoMode)

        if (inDemoMode) {
          // In demo mode, check if we have a stored user
          const isLoggedIn = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY) === "true"
          if (isLoggedIn) {
            const demoUser = loadDemoUser() || DEMO_USER
            setUser(demoUser)
          } else {
            setUser(null)
          }
          setLoading(false)
          return
        }

        // Not in demo mode, try to get Supabase session
        try {
          const supabase = getSupabase()
          const {
            data: { session },
          } = await supabase.auth.getSession()

          if (session) {
            // Get user profile
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("user_id", session.user.id)
              .single()

            if (profileError) {
              console.error("Error fetching profile:", profileError)
              setUser(null)
            } else if (profile) {
              const userData = await profileToUser(profile as Profile)
              setUser(userData)
            }
          } else {
            setUser(null)
          }
        } catch (error) {
          console.error("Error checking auth:", error)
          setUser(null)
        }
      } catch (err) {
        console.error("Authentication error:", err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Set up auth state change listener if not in demo mode
    let unsubscribe = () => {}

    if (!isInDemoMode()) {
      try {
        const supabase = getSupabase()
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === "SIGNED_IN" && session) {
            // Get user profile
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("user_id", session.user.id)
              .single()

            if (profileError) {
              console.error("Error fetching profile:", profileError)
              setUser(null)
            } else if (profile) {
              const userData = await profileToUser(profile as Profile)
              setUser(userData)
            }
          } else if (event === "SIGNED_OUT") {
            setUser(null)
          }
        })

        unsubscribe = data.subscription.unsubscribe
      } catch (error) {
        console.error("Error setting up auth state change listener:", error)
      }
    }

    // Cleanup subscription
    return () => {
      unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      if (demoMode) {
        // In demo mode, simulate sign in
        if (email === "demo@example.com" && password === "password") {
          const demoUser = loadDemoUser() || DEMO_USER
          setUser(demoUser)
          localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, "true")
          saveDemoUser(demoUser)
          router.push("/dashboard")
        } else {
          throw new Error("Invalid email or password")
        }
      } else {
        // Real sign in with Supabase
        const supabase = getSupabase()
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          throw error
        }

        if (data.user) {
          // Get user profile
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", data.user.id)
            .single()

          if (profileError) {
            console.error("Error fetching profile:", profileError)
            throw new Error("Failed to fetch user profile")
          }

          const userData = await profileToUser(profile as Profile)
          setUser(userData)
          router.push("/dashboard")
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in")
      console.error("Sign in error:", err)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      if (demoMode) {
        // In demo mode, simulate sign up
        const newUser: User = {
          ...DEMO_USER,
          id: `demo-${uuidv4()}`,
          email,
          name: null,
          createdAt: new Date(),
        }
        setUser(newUser)
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, "true")
        saveDemoUser(newUser)

        toast({
          title: "Account created",
          description: "Your demo account has been created successfully!",
        })

        router.push("/profile/setup")
      } else {
        // Real sign up with Supabase
        const supabase = getSupabase()
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) {
          throw error
        }

        if (data.user) {
          // Create user profile
          const { error: profileError } = await supabase.from("profiles").insert([
            {
              user_id: data.user.id,
              email: data.user.email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])

          if (profileError) {
            console.error("Error creating profile:", profileError)
            throw new Error("Failed to create user profile")
          }

          // Get the created profile
          const { data: profile, error: fetchProfileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", data.user.id)
            .single()

          if (fetchProfileError) {
            console.error("Error fetching profile:", fetchProfileError)
            throw new Error("Failed to fetch user profile")
          }

          const userData = await profileToUser(profile as Profile)
          setUser(userData)

          toast({
            title: "Account created",
            description: "Your account has been created successfully!",
          })

          router.push("/profile/setup")
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign up")
      console.error("Sign up error:", err)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)

    try {
      if (demoMode) {
        // In demo mode, simulate sign out
        setUser(null)
        localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY)
        router.push("/")
      } else {
        // Real sign out with Supabase
        const supabase = getSupabase()
        const { error } = await supabase.auth.signOut()

        if (error) {
          throw error
        }

        setUser(null)
        router.push("/")
      }
    } catch (err: any) {
      console.error("Sign out error:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to sign out",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    setLoading(true)
    setError(null)

    try {
      if (!user) {
        throw new Error("No user logged in")
      }

      if (demoMode) {
        // In demo mode, update local user
        const updatedUser = {
          ...user,
          ...data,
        }
        setUser(updatedUser)
        saveDemoUser(updatedUser)
      } else {
        // Real update with Supabase
        const supabase = getSupabase()
        const { error } = await supabase
          .from("profiles")
          .update({
            name: data.name,
            profile_image: data.profileImage,
            academic_level: data.academicLevel,
            institution: data.institution,
            field_of_study: data.fieldOfStudy,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)

        if (error) {
          throw error
        }

        // Get updated profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (profileError) {
          throw profileError
        }

        const updatedUser = await profileToUser(profile as Profile)
        setUser(updatedUser)
      }
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
      console.error("Update profile error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const saveAssessmentResult = async (result: Omit<AssessmentResult, "id" | "date">) => {
    setLoading(true)
    setError(null)

    try {
      if (!user) {
        throw new Error("No user logged in")
      }

      if (demoMode) {
        // In demo mode, save to local storage
        const newResult: AssessmentResult = {
          id: uuidv4(),
          date: new Date(),
          ...result,
        }

        const updatedUser = {
          ...user,
          assessmentResults: [newResult, ...user.assessmentResults],
        }

        setUser(updatedUser)
        saveDemoUser(updatedUser)
      } else {
        // Real save with Supabase
        const supabase = getSupabase()
        const { data, error } = await supabase
          .from("assessment_results")
          .insert([
            {
              user_id: user.id,
              primary_archetype: result.primaryArchetype,
              secondary_archetype: result.secondaryArchetype,
              dimensions: result.dimensions,
              archetype_scores: result.archetypeScores,
              created_at: new Date().toISOString(),
            },
          ])
          .select()

        if (error) {
          throw error
        }

        // Get the created assessment result
        const newResult = data[0] as AssessmentResultRecord

        // Update user state with new assessment result
        const assessmentResult: AssessmentResult = {
          id: newResult.id,
          date: new Date(newResult.created_at),
          dimensions: newResult.dimensions,
          primaryArchetype: newResult.primary_archetype,
          secondaryArchetype: newResult.secondary_archetype,
          archetypeScores: newResult.archetype_scores,
        }

        setUser((prevUser) => {
          if (!prevUser) return null
          return {
            ...prevUser,
            assessmentResults: [assessmentResult, ...prevUser.assessmentResults],
          }
        })
      }
    } catch (err: any) {
      setError(err.message || "Failed to save assessment result")
      console.error("Save assessment result error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    setLoading(true)
    setError(null)

    try {
      if (demoMode) {
        // In demo mode, simulate password reset
        toast({
          title: "Demo Mode",
          description: "Password reset is not available in demo mode. Use demo@example.com and password to sign in.",
        })
      } else {
        // Real password reset with Supabase
        const supabase = getSupabase()
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })

        if (error) {
          throw error
        }

        toast({
          title: "Password reset email sent",
          description: "Check your email for a link to reset your password",
        })
      }
    } catch (err: any) {
      setError(err.message || "Failed to send password reset email")
      console.error("Reset password error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (password: string) => {
    setLoading(true)
    setError(null)

    try {
      if (demoMode) {
        // In demo mode, simulate password update
        toast({
          title: "Demo Mode",
          description: "Password update is not available in demo mode.",
        })
      } else {
        // Real password update with Supabase
        const supabase = getSupabase()
        const { error } = await supabase.auth.updateUser({
          password,
        })

        if (error) {
          throw error
        }

        toast({
          title: "Password updated",
          description: "Your password has been updated successfully",
        })
      }
    } catch (err: any) {
      setError(err.message || "Failed to update password")
      console.error("Update password error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteAccount = async () => {
    setLoading(true)
    setError(null)

    try {
      if (!user) {
        throw new Error("No user logged in")
      }

      if (demoMode) {
        // In demo mode, simulate account deletion
        setUser(null)
        localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY)
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY)

        toast({
          title: "Account deleted",
          description: "Your demo account has been deleted successfully",
        })

        router.push("/")
      } else {
        // Real account deletion with Supabase
        const supabase = getSupabase()
        // Delete assessment results
        const { error: deleteResultsError } = await supabase.from("assessment_results").delete().eq("user_id", user.id)

        if (deleteResultsError) {
          throw deleteResultsError
        }

        // Delete profile
        const { error: deleteProfileError } = await supabase.from("profiles").delete().eq("user_id", user.id)

        if (deleteProfileError) {
          throw deleteProfileError
        }

        // Delete user
        const { error: deleteUserError } = await supabase.auth.admin.deleteUser(user.id)

        if (deleteUserError) {
          throw deleteUserError
        }

        // Sign out
        await signOut()

        toast({
          title: "Account deleted",
          description: "Your account has been deleted successfully",
        })

        router.push("/")
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete account")
      console.error("Delete account error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    demoMode,
    signIn,
    signUp,
    signOut,
    updateProfile,
    saveAssessmentResult,
    resetPassword,
    updatePassword,
    deleteAccount,
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
