"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle, AlertTriangle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

interface AssessmentCompleteModalProps {
  isOpen: boolean
  onContinue: () => void
  onCancel: () => void
  answeredCount: number
  totalCount: number
}

export function AssessmentCompleteModal({
  isOpen,
  onContinue,
  onCancel,
  answeredCount,
  totalCount,
}: AssessmentCompleteModalProps) {
  const { user } = useAuth()
  const isComplete = answeredCount === totalCount

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {isComplete ? (
              <>
                <CheckCircle className="h-5 w-5 text-primary mr-2" />
                Assessment Complete
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                Incomplete Assessment
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isComplete
              ? "You have answered all questions in the assessment."
              : `You've answered ${answeredCount} of ${totalCount} questions. Unanswered questions may affect your results.`}
          </DialogDescription>
        </DialogHeader>

        {!user && (
          <div className="bg-amber-50 p-3 rounded border border-amber-200 text-sm text-amber-800">
            <p className="font-medium">You're not signed in</p>
            <p>
              Your results will not be saved to a profile.{" "}
              <Link href="/signin" className="underline font-medium">
                Sign in
              </Link>{" "}
              or{" "}
              <Link href="/signup" className="underline font-medium">
                create an account
              </Link>{" "}
              to save your results.
            </p>
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={onCancel}>
            {isComplete ? "Review Answers" : "Continue Answering"}
          </Button>
          <Button onClick={onContinue}>{isComplete ? "View Results" : "Submit Anyway"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
