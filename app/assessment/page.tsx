"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { questions } from "@/data/questions"
import { calculateResults } from "@/lib/calculate-results"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, ArrowRight, Save } from "lucide-react"
import { LikertScale } from "@/components/likert-scale"
import { ScenarioQuestion } from "@/components/scenario-question"
import { AssessmentIntro } from "@/components/assessment-intro"
import { AssessmentCompleteModal } from "@/components/assessment-complete-modal"

export default function AssessmentPage() {
  const router = useRouter()
  const { user, saveAssessmentResult } = useAuth()
  const { toast } = useToast()

  const [showIntro, setShowIntro] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number | string>>({})
  const [selectedOption, setSelectedOption] = useState<number | string | null>(null)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [saveInProgress, setSaveInProgress] = useState(false)

  const progress = (Object.keys(answers).length / questions.length) * 100
  const questionProgress = ((currentQuestion + 1) / questions.length) * 100

  // Get current question
  const question = questions[currentQuestion]

  // Check if this is the last question
  const isLastQuestion = currentQuestion === questions.length - 1

  useEffect(() => {
    // Load saved answers from localStorage
    const savedAnswers = localStorage.getItem("assessment-answers")
    if (savedAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedAnswers)
        setAnswers(parsedAnswers)
      } catch (error) {
        console.error("Failed to parse saved answers", error)
      }
    }
  }, [])

  useEffect(() => {
    // Set the selected option if we already have an answer for this question
    setSelectedOption(answers[questions[currentQuestion].id] || null)
  }, [currentQuestion, answers])

  // Save answers to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("assessment-answers", JSON.stringify(answers))
    } catch (error) {
      console.error("Failed to save answers to localStorage", error)
    }
  }, [answers])

  // Handle clicking next
  const handleNext = () => {
    if (selectedOption !== null) {
      // Save the answer
      setAnswers((prev) => ({
        ...prev,
        [question.id]: selectedOption,
      }))

      // If last question, show completion modal
      if (isLastQuestion) {
        setShowConfirmationModal(true)
      } else {
        // Move to next question
        setCurrentQuestion((prev) => prev + 1)
      }
    }
  }

  // Handle clicking previous
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  // Handle likert selection
  const handleLikertSelect = (value: number) => {
    setSelectedOption(value)
  }

  // Handle scenario selection
  const handleScenarioSelect = (value: string) => {
    setSelectedOption(value)
  }

  // Handle completion confirmation
  const handleCompleteAssessment = async () => {
    setShowConfirmationModal(false)
    setSaveInProgress(true)

    try {
      // Calculate result
      const results = calculateResults(answers)

      // If user is logged in, save the result to their profile
      if (user) {
        try {
          await saveAssessmentResult({
            dimensions: results.dimensions,
            primaryArchetype: results.primaryArchetype,
            secondaryArchetype: results.secondaryArchetype,
            archetypeScores: results.archetypeScores,
          })

          toast({
            title: "Assessment completed",
            description: "Your results have been saved to your profile.",
          })
        } catch (error) {
          console.error("Failed to save assessment result:", error)
          toast({
            title: "Error",
            description: "Failed to save your assessment results. Your results will still be displayed.",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Assessment completed",
          description: "Your results are ready to view.",
        })
      }

      // Redirect to results page
      router.push(`/results?data=${encodeURIComponent(JSON.stringify(results))}`)
    } catch (error) {
      console.error("Error completing assessment:", error)
      toast({
        title: "Error",
        description: "There was a problem processing your assessment. Please try again.",
        variant: "destructive",
      })
      setSaveInProgress(false)
    }
  }

  // If showing intro screen
  if (showIntro) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <AssessmentIntro onStart={() => setShowIntro(false)} questionCount={questions.length} />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium">
                {Object.keys(answers).length} answered • {Math.round(progress)}% complete
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary animated-progress"
                style={{ "--progress-width": `${questionProgress}%` } as React.CSSProperties}
              ></div>
            </div>
            <div className="h-1 w-full bg-muted/50 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-secondary animated-progress"
                style={{ "--progress-width": `${progress}%` } as React.CSSProperties}
              ></div>
            </div>
          </div>

          <Card className="border-none shadow-lg">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="text-xl text-center">{question.text}</CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                {question.inverted ? "Note: This question is inversely scored." : `Dimension: ${question.dimension}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {question.type === "likert" ? (
                <LikertScale
                  value={typeof selectedOption === "number" ? selectedOption : null}
                  onChange={handleLikertSelect}
                />
              ) : (
                <ScenarioQuestion
                  options={question.options || []}
                  value={typeof selectedOption === "string" ? selectedOption : null}
                  onChange={handleScenarioSelect}
                />
              )}
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0 || saveInProgress}
              className="px-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-4">
              {Object.keys(answers).length > 0 && (
                <Button variant="outline" onClick={() => setShowConfirmationModal(true)} disabled={saveInProgress}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLastQuestion ? "Finish" : "Save & Exit"}
                </Button>
              )}

              <Button
                onClick={handleNext}
                disabled={selectedOption === null || saveInProgress}
                className="bg-primary hover:bg-primary/90 px-6"
              >
                {isLastQuestion ? "Complete" : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AssessmentCompleteModal
        isOpen={showConfirmationModal}
        onContinue={handleCompleteAssessment}
        onCancel={() => setShowConfirmationModal(false)}
        answeredCount={Object.keys(answers).length}
        totalCount={questions.length}
      />
    </>
  )
}
