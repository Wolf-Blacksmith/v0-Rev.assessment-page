"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { BookOpen, Brain, BarChart, ArrowRight } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="mb-6">You need to be signed in to view your dashboard.</p>
          <Link href="/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="hero-section">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome, {user.name || "Student"}</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Track your learning journey and discover personalized study strategies
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          <Card className="archetype-card border-primary/20 hover:border-primary">
            <div className="archetype-card-header bg-primary/10">
              <div className="archetype-icon text-primary">
                <BookOpen className="w-full h-full" />
              </div>
              <CardTitle className="text-xl">Take Assessment</CardTitle>
            </div>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground mb-6">
                Discover your unique learning style with our comprehensive assessment.
              </p>
              <Button className="w-full" asChild>
                <Link href="/assessment">Start Assessment</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="archetype-card border-secondary/20 hover:border-secondary">
            <div className="archetype-card-header bg-secondary/10">
              <div className="archetype-icon text-secondary">
                <BarChart className="w-full h-full" />
              </div>
              <CardTitle className="text-xl">View Results</CardTitle>
            </div>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground mb-6">
                Review your assessment results and track your progress over time.
              </p>
              <Button variant="outline" className="w-full" disabled>
                No Results Yet
              </Button>
            </CardContent>
          </Card>

          <Card className="archetype-card border-accent/20 hover:border-accent">
            <div className="archetype-card-header bg-accent/10">
              <div className="archetype-icon text-accent">
                <Brain className="w-full h-full" />
              </div>
              <CardTitle className="text-xl">Explore Resources</CardTitle>
            </div>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground mb-6">
                Access study strategies and tools tailored to your learning style.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/resources">Browse Resources</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>

          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Learning Journey</CardTitle>
              <CardDescription>Track your progress and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You haven't taken any assessments yet.</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Complete your first assessment to start your learning journey.
                </p>
                <Button asChild>
                  <Link href="/assessment">Take Assessment Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold mb-6">Recommended Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Study Habit Fundamentals</CardTitle>
                <CardDescription>Essential strategies for academic success</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Learn the core principles of effective studying that apply to all learning styles.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/resources/fundamentals">
                    <span>Explore</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Learning Style Guide</CardTitle>
                <CardDescription>Understanding the five learning archetypes</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Explore the characteristics and strategies for each learning archetype.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/resources/archetypes">
                    <span>Explore</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
