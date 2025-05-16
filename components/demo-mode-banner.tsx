"use client"

import { useAuth } from "@/lib/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export function DemoModeBanner() {
  const { demoMode } = useAuth()

  if (!demoMode) return null

  return (
    <Alert className="mb-6 bg-amber-50 border-amber-200">
      <InfoIcon className="h-4 w-4 text-amber-500" />
      <AlertTitle className="text-amber-700">Demo Mode Active</AlertTitle>
      <AlertDescription className="text-amber-600">
        <p>
          The application is running in demo mode because Supabase environment variables are missing. Some features may
          be limited.
        </p>
        <p className="mt-2 text-sm">
          <strong>Demo credentials:</strong> Email: demo@example.com, Password: password
        </p>
      </AlertDescription>
    </Alert>
  )
}
