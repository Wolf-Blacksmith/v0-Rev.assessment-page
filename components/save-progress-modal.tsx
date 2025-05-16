"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { Loader2, Save, Lock } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

interface SaveProgressModalProps {
  isOpen: boolean
  onClose: () => void
  progress: number
  answeredCount: number
  totalCount: number
}

export function SaveProgressModal({ isOpen, onClose, progress, answeredCount, totalCount }: SaveProgressModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)

    // Simulate saving progress
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Progress saved",
        description: "You can return to complete the assessment later.",
      })
      onClose()
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Save className="h-5 w-5 mr-2 text-primary" />
            Save Assessment Progress
          </DialogTitle>
          <DialogDescription>You've completed {Math.round(progress)}% of the assessment.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-3">
            <div className="h-full bg-primary" style={{ width: `${progress}%` }}></div>
          </div>

          <p className="text-sm text-center mb-4">
            {answeredCount} of {totalCount} questions answered
          </p>

          {!user ? (
            <div className="bg-muted p-4 rounded-lg border text-center">
              <Lock className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-medium mb-2">Sign in to save your progress</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create an account or sign in to save your progress and access your results anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Create Account</Link>
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-center mb-4">
              Your progress will be saved to your account. You can return to complete the assessment at any time.
            </p>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Continue Assessment
          </Button>
          {user && (
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save & Exit"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
