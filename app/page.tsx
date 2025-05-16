import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { BookOpen, Brain, BarChart } from "lucide-react"
import { DemoModeBanner } from "@/components/demo-mode-banner"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <div className="hero-section">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Study Habits Assessment</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90 mb-6">
            Discover your unique learning profile and unlock personalized study strategies
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <DemoModeBanner />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="archetype-card border-primary/20 hover:border-primary">
            <div className="archetype-card-header bg-primary/10">
              <div className="archetype-icon text-primary">
                <BookOpen className="w-full h-full" />
              </div>
              <CardTitle className="text-xl">Complete the Assessment</CardTitle>
            </div>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Answer 26 questions about your study habits and learning preferences.
              </p>
            </CardContent>
          </Card>

          <Card className="archetype-card border-secondary/20 hover:border-secondary">
            <div className="archetype-card-header bg-secondary/10">
              <div className="archetype-icon text-secondary">
                <BarChart className="w-full h-full" />
              </div>
              <CardTitle className="text-xl">View Detailed Results</CardTitle>
            </div>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                See how you score across 12 key dimensions of effective studying.
              </p>
            </CardContent>
          </Card>

          <Card className="archetype-card border-accent/20 hover:border-accent">
            <div className="archetype-card-header bg-accent/10">
              <div className="archetype-icon text-accent">
                <Brain className="w-full h-full" />
              </div>
              <CardTitle className="text-xl">Get Personalized Strategies</CardTitle>
            </div>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Receive tailored recommendations to improve your academic performance.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Link href="/assessment">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg">
              Start Assessment
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
