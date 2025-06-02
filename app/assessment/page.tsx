"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Navbar } from "@/components/navbar"
import { questions } from "@/data/questions"
import { preliminaryQuestions } from "@/data/preliminary-questions"
import { calculateResults } from "@/lib/calculate-results"

type AnswerType = number | string | string[]
type SelectedOptionsType = Record<number, AnswerType | null>

interface BaseQuestion {
  id: number
  text: string
  category: string
  options?: Array<{
    value: string
    label: string
  }>
}

interface PreliminaryQuestion extends BaseQuestion {
  type: "multiple-choice" | "text"
}

interface MainQuestion extends BaseQuestion {
  type: "likert" | "scenario"
  dimension: string
  inverted?: boolean
}

type Question = PreliminaryQuestion | MainQuestion

export default function AssessmentPage() {
  const router = useRouter()
  const [isPreliminary, setIsPreliminary] = useState(true)
  const [currentBatch, setCurrentBatch] = useState(0)
  const [answers, setAnswers] = useState<Record<number, AnswerType>>({})
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionsType>({})
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  const currentQuestions = isPreliminary ? preliminaryQuestions : questions
  const questionsPerBatch = 5 // Show 5 questions per batch on desktop
  const totalBatches = Math.ceil(currentQuestions.length / questionsPerBatch)
  const progress = ((currentBatch * questionsPerBatch) / currentQuestions.length) * 100

  // Get current batch of questions
  const getCurrentBatchQuestions = () => {
    const start = currentBatch * questionsPerBatch
    const end = Math.min(start + questionsPerBatch, currentQuestions.length)
    return currentQuestions.slice(start, end)
  }

  const handleNext = () => {
    // Check if all questions in current batch are answered
    const currentBatchQuestions = getCurrentBatchQuestions()
    const allAnswered = currentBatchQuestions.every((_, index) => {
      const questionIndex = currentBatch * questionsPerBatch + index
      return selectedOptions[questionIndex] !== null
    })

    if (allAnswered) {
      // Save all answers from current batch
      const newAnswers = { ...answers }
      currentBatchQuestions.forEach((_, index) => {
        const questionIndex = currentBatch * questionsPerBatch + index
        newAnswers[questionIndex] = selectedOptions[questionIndex]!
      })
      setAnswers(newAnswers)

      // Move to next batch or finish
      if (currentBatch < totalBatches - 1) {
        setCurrentBatch((prev: number) => prev + 1)
      } else if (isPreliminary) {
        // Switch to main assessment
        setIsPreliminary(false)
        setCurrentBatch(0)
        setSelectedOptions({})
      } else {
        // Calculate result and redirect
        const results = calculateResults(answers)
        router.push(`/results?data=${encodeURIComponent(JSON.stringify(results))}`)
      }
    }
  }

  const handlePrevious = () => {
    if (currentBatch > 0) {
      setCurrentBatch((prev: number) => prev - 1)
    } else if (!isPreliminary) {
      // Go back to preliminary questions
      setIsPreliminary(true)
      setCurrentBatch(Math.ceil(preliminaryQuestions.length / questionsPerBatch) - 1)
    }
  }

  const handleOptionSelect = (questionIndex: number, value: AnswerType) => {
    setSelectedOptions((prev: SelectedOptionsType) => ({
      ...prev,
      [questionIndex]: value
    }))
  }

  const handleLikertSelect = (questionIndex: number, value: string) => {
    handleOptionSelect(questionIndex, Number.parseInt(value))
  }

  const handleScenarioSelect = (questionIndex: number, value: string) => {
    handleOptionSelect(questionIndex, value)
  }

  const handleGoalToggle = (value: string) => {
    setSelectedGoals((prev: string[]) => {
      if (prev.includes(value)) {
        return prev.filter((v: string) => v !== value)
      }
      return [...prev, value]
    })
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                {isPreliminary ? "Preliminary Questions" : "Questions"} {currentBatch * questionsPerBatch + 1}-
                {Math.min((currentBatch + 1) * questionsPerBatch, currentQuestions.length)} of {currentQuestions.length}
              </span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-6">
            {getCurrentBatchQuestions().map((question: Question, batchIndex: number) => {
              const questionIndex = currentBatch * questionsPerBatch + batchIndex
              const isAnswered = selectedOptions[questionIndex] !== null

              return (
                <Card 
                  key={questionIndex}
                  className={`border-none shadow-lg transition-all duration-300 ${
                    isAnswered ? 'opacity-60' : 'opacity-100'
                  }`}
                >
                  <CardHeader className="bg-primary/5 border-b">
                    <div className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">
                      {question.category}
                    </div>
                    <CardTitle className="text-lg sm:text-xl text-center">{question.text}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-8">
                    {question.type === "likert" ? (
                      <div className="likert-scale">
                        <div className="likert-label text-primary text-sm sm:text-base">Agree</div>
                        <div className="flex-1 flex justify-between items-center max-w-md mx-auto">
                          {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                            <div
                              key={value}
                              className={`option-circle w-8 h-8 sm:w-10 sm:h-10 transition-all duration-200 ${
                                value <= 3
                                  ? "border-primary hover:border-primary"
                                  : value === 4
                                    ? "border-gray-400 hover:border-gray-500"
                                    : "border-purple-500 hover:border-purple-600"
                              } 
                              ${selectedOptions[questionIndex] === value ? "selected scale-90" : ""}`}
                              onClick={() => handleLikertSelect(questionIndex, value.toString())}
                            >
                              {selectedOptions[questionIndex] === value && (
                                <div
                                  className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full transition-all duration-200 ${
                                    value <= 3 ? "bg-primary" : value === 4 ? "bg-gray-400" : "bg-purple-500"
                                  }`}
                                ></div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="likert-label text-purple-500 text-sm sm:text-base">Disagree</div>
                      </div>
                    ) : question.type === "scenario" || question.type === "multiple-choice" ? (
                      <RadioGroup
                        value={selectedOptions[questionIndex]?.toString() || ""}
                        onValueChange={(value) => handleScenarioSelect(questionIndex, value)}
                        className="space-y-3 mt-4"
                      >
                        {question.options?.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-start space-x-3 border rounded-lg p-3 sm:p-4 hover:bg-muted/50 transition-colors"
                          >
                            <RadioGroupItem value={option.value} id={`option-${option.value}`} className="mt-1" />
                            <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer text-sm sm:text-base">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : question.type === "text" ? (
                      <div className="space-y-3 mt-4">
                        <input
                          type="text"
                          value={selectedOptions[questionIndex]?.toString() || ""}
                          onChange={(e) => handleOptionSelect(questionIndex, e.target.value)}
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Type your answer here..."
                        />
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-6 sm:mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentBatch === 0 && isPreliminary}
              className="px-4 sm:px-6 text-sm sm:text-base"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!getCurrentBatchQuestions().every((_, index) => {
                const questionIndex = currentBatch * questionsPerBatch + index
                return selectedOptions[questionIndex] !== null
              })}
              className="bg-primary hover:bg-primary/90 px-4 sm:px-6 text-sm sm:text-base"
            >
              {currentBatch < totalBatches - 1
                ? "Next"
                : isPreliminary
                ? "Start Assessment"
                : "See Results"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
