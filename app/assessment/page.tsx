"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import { questions } from "@/data/questions"
import { calculateResults } from "@/lib/calculate-results"

export default function AssessmentPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number | string>>({})
  const [selectedOption, setSelectedOption] = useState<number | string | null>(null)

  const progress = (currentQuestion / questions.length) * 100

  useEffect(() => {
    // Set the selected option if we already have an answer for this question
    setSelectedOption(answers[currentQuestion] || null)
  }, [currentQuestion, answers])

  const handleNext = () => {
    if (selectedOption !== null) {
      // Save the answer
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion]: selectedOption,
      }))

      // Move to next question or finish
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
      } else {
        // Calculate result and redirect
        const results = calculateResults(answers)
        router.push(`/results?data=${encodeURIComponent(JSON.stringify(results))}`)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleLikertSelect = (value: string) => {
    setSelectedOption(Number.parseInt(value))
  }

  const handleScenarioSelect = (value: string) => {
    setSelectedOption(value)
  }

  const question = questions[currentQuestion]

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
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary animated-progress"
                style={{ "--progress-width": `${progress}%` } as React.CSSProperties}
              ></div>
            </div>
          </div>

          <Card className="border-none shadow-lg">
            <CardHeader className="bg-primary/5 border-b">
              <div className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">
                {question.dimension}
              </div>
              <CardTitle className="text-xl text-center">{question.text}</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {question.type === "likert" ? (
                <div className="likert-scale">
                  <div className="likert-label text-primary">Agree</div>

                  <div className="flex-1 flex justify-between items-center max-w-md mx-auto">
                    {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                      <div
                        key={value}
                        className={`option-circle ${
                          value <= 3
                            ? "border-primary hover:border-primary"
                            : value === 4
                              ? "border-gray-400 hover:border-gray-500"
                              : "border-purple-500 hover:border-purple-600"
                        } 
                                ${selectedOption === value ? "selected" : ""}`}
                        onClick={() => handleLikertSelect(value.toString())}
                      >
                        {selectedOption === value && (
                          <div
                            className={`w-6 h-6 rounded-full ${
                              value <= 3 ? "bg-primary" : value === 4 ? "bg-gray-400" : "bg-purple-500"
                            }`}
                          ></div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="likert-label text-purple-500">Disagree</div>
                </div>
              ) : (
                <RadioGroup
                  value={selectedOption?.toString() || ""}
                  onValueChange={handleScenarioSelect}
                  className="space-y-3 mt-4"
                >
                  {question.options?.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <RadioGroupItem value={option.value} id={`option-${option.value}`} className="mt-1" />
                      <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0} className="px-6">
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={selectedOption === null}
              className="bg-primary hover:bg-primary/90 px-6"
            >
              {currentQuestion < questions.length - 1 ? "Next" : "See Results"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
