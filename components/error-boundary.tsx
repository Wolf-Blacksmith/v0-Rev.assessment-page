"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Error caught by error boundary:", event.error)
      setError(event.error)
      setHasError(true)
    }

    window.addEventListener("error", handleError)

    return () => {
      window.removeEventListener("error", handleError)
    }
  }, [])

  if (hasError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto border-red-200">
          <CardHeader className="bg-red-50 text-red-700">
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4">
              We're having trouble connecting to our services. This might be due to missing configuration or a temporary
              issue.
            </p>
            {error && (
              <div className="bg-gray-100 p-3 rounded text-sm font-mono overflow-auto max-h-32">{error.message}</div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => {
                setHasError(false)
                window.location.reload()
              }}
              className="w-full"
            >
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
