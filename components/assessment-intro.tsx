"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CheckCircle, ArrowRight, Info } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface AssessmentIntroProps {
  onStart: () => void
  questionCount: number
}

export function AssessmentIntro({ onStart, questionCount }: AssessmentIntroProps) {
  const [agreementChecked, setAgreementChecked] = useState(false)

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="bg-primary/5 border-b">
        <CardTitle className="text-2xl text-center">Learning Assessment</CardTitle>
        <CardDescription className="text-center text-base">
          Discover your unique learning archetype and study preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
            <Clock className="h-10 w-10 text-primary mb-2" />
            <h3 className="font-medium text-lg mb-1">Duration</h3>
            <p className="text-center text-muted-foreground">
              Approximately 10-15 minutes to complete {questionCount} questions
            </p>
          </div>

          <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
            <CheckCircle className="h-10 w-10 text-primary mb-2" />
            <h3 className="font-medium text-lg mb-1">Assessment</h3>
            <p className="text-center text-muted-foreground">
              Answer honestly for the most accurate results and recommendations
            </p>
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800">Instructions</h3>
              <p className="text-sm text-amber-700">
                You'll be presented with questions about your study habits and learning preferences. For each question,
                select the option that best describes you. There are no right or wrong answers.
              </p>
            </div>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="faq-1">
            <AccordionTrigger>What is a learning archetype?</AccordionTrigger>
            <AccordionContent>
              Learning archetypes are patterns of how you best absorb, process, and retain information. This assessment
              will identify your primary and secondary learning archetypes, helping you understand your strengths and
              providing strategies tailored to your learning style.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-2">
            <AccordionTrigger>How can I use the results?</AccordionTrigger>
            <AccordionContent>
              Your results will include personalized study techniques, recommended tools, and strategies designed
              specifically for your learning archetype. You can immediately apply these to improve your study
              effectiveness and academic performance.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-3">
            <AccordionTrigger>Can I save my results?</AccordionTrigger>
            <AccordionContent>
              Yes! If you have an account and are signed in, your results will be automatically saved to your profile.
              You can access them anytime and even track how your learning style evolves over time by taking the
              assessment again in the future.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex items-center space-x-2 pt-3">
          <input
            type="checkbox"
            id="agreement"
            className="rounded text-primary focus:ring-primary"
            checked={agreementChecked}
            onChange={(e) => setAgreementChecked(e.target.checked)}
          />
          <label htmlFor="agreement" className="text-sm text-muted-foreground">
            I understand that my responses will be used to generate personalized learning recommendations
          </label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t p-6">
        <Button onClick={onStart} disabled={!agreementChecked} className="w-full md:w-auto" size="lg">
          Start Assessment
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
