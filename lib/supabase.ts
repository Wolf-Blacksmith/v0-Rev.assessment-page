import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Types for our database tables
export type Profile = {
  id: string
  user_id: string
  name: string | null
  email: string
  profile_image: string | null
  academic_level: string | null
  institution: string | null
  field_of_study: string | null
  created_at: string
  updated_at: string
}

export type AssessmentResultRecord = {
  id: string
  user_id: string
  primary_archetype: string
  secondary_archetype: string
  dimensions: Array<{ dimension: string; score: number }>
  archetype_scores: Array<{ id: string; score: number; match: number }>
  created_at: string
}

// Global variable to store the Supabase client instance
let supabaseInstance: SupabaseClient | null = null

// Flag to indicate if we're in demo mode (no Supabase)
let isDemoMode = false

// Check if we're in demo mode
export function isInDemoMode(): boolean {
  return isDemoMode
}

// Initialize the Supabase client
export function initSupabase() {
  // If we already have an instance, return it
  if (supabaseInstance) return supabaseInstance

  // Get environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if environment variables are available
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables are missing. Running in demo mode.")
    isDemoMode = true
    return null
  }

  try {
    // Create the Supabase client
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
    return supabaseInstance
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error)
    isDemoMode = true
    return null
  }
}

// Get the Supabase client (lazy-loaded)
export function getSupabase(): SupabaseClient {
  // Initialize if not already done
  if (!supabaseInstance) {
    initSupabase()
  }

  // If still null (demo mode), throw a clear error
  if (!supabaseInstance) {
    throw new Error("Supabase client not available. Application is running in demo mode.")
  }

  return supabaseInstance
}
