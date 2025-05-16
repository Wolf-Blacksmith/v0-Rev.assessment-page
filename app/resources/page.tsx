"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import {
  BookOpen,
  Brain,
  Calendar,
  Users,
  RefreshCw,
  FileText,
  Lightbulb,
  Clock,
  Target,
  Layers,
  ArrowRight,
} from "lucide-react"
import { Input } from "@/components/ui/input"

export default function ResourcesPage() {
  const { user } = useAuth()

  return (
    <>
      <Navbar />
      <div className="hero-section">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Learning Resources</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Explore study strategies, tools, and insights for academic success
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="relative">
              <Input type="search" placeholder="Search resources..." className="pl-10" />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-search"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full mb-8">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="all">All Resources</TabsTrigger>
              <TabsTrigger value="archetypes">Learning Archetypes</TabsTrigger>
              <TabsTrigger value="strategies">Study Strategies</TabsTrigger>
              <TabsTrigger value="tools">Tools & Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Assessment Overview</CardTitle>
                    <CardDescription>Understanding the evaluation process</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Learn about the 12 dimensions measured in our assessment and how they relate to academic success.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/resources/assessment">
                        <span>Read More</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                      <Brain className="h-5 w-5 text-secondary" />
                    </div>
                    <CardTitle className="text-lg">Learning Archetypes</CardTitle>
                    <CardDescription>The five student profiles</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Explore the characteristics, strengths, and challenges of each learning archetype.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/resources/archetypes">
                        <span>Read More</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                      <Lightbulb className="h-5 w-5 text-accent" />
                    </div>
                    <CardTitle className="text-lg">Study Techniques</CardTitle>
                    <CardDescription>Evidence-based learning methods</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Discover proven study techniques backed by research and tailored to different learning styles.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/resources/techniques">
                        <span>Read More</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <h2 className="text-2xl font-bold mb-6">Learning Archetypes</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <Card className="border-blue-200 hover:border-blue-300">
                  <CardHeader className="pb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">The Organizer</CardTitle>
                    <CardDescription>Structured, methodical, and detail-oriented</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Excels at planning and structuring academic work with clear expectations and deadlines.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/resources/archetypes/organizer">
                        <span>Learn More</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border-purple-200 hover:border-purple-300">
                  <CardHeader className="pb-2">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                      <BookOpen className="h-5 w-5 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">The Deep Diver</CardTitle>
                    <CardDescription>Focused, analytical, and thorough</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Excels at concentrated, in-depth study of subjects with comprehensive understanding.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/resources/archetypes/deep-diver">
                        <span>Learn More</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border-green-200 hover:border-green-300">
                  <CardHeader className="pb-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">The Collaborator</CardTitle>
                    <CardDescription>Interactive, communicative, and team-oriented</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Thrives in social learning environments and excels when working with others.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/resources/archetypes/collaborator">
                        <span>Learn More</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border-orange-200 hover:border-orange-300">
                  <CardHeader className="pb-2">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                      <RefreshCw className="h-5 w-5 text-orange-600" />
                    </div>
                    <CardTitle className="text-lg">The Adaptive Learner</CardTitle>
                    <CardDescription>Flexible, tech-savvy, and resourceful</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Excels at adjusting approach based on changing circumstances and diverse environments.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/resources/archetypes/adaptive-learner">
                        <span>Learn More</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border-teal-200 hover:border-teal-300">
                  <CardHeader className="pb-2">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mb-2">
                      <Brain className="h-5 w-5 text-teal-600" />
                    </div>
                    <CardTitle className="text-lg">The Reflective Thinker</CardTitle>
                    <CardDescription>Contemplative, self-aware, and thoughtful</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Excels at monitoring learning process and thinking deeply about concepts and insights.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/resources/archetypes/reflective-thinker">
                        <span>Learn More</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <h2 className="text-2xl font-bold mb-6">Study Dimensions</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Self-Regulation</CardTitle>
                    <CardDescription>Managing impulses and staying focused</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Strategies for setting goals, avoiding distractions, and maintaining focus on tasks.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Time Management</CardTitle>
                    <CardDescription>Optimizing study schedules and deadlines</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Techniques for planning study sessions, managing deadlines, and avoiding procrastination.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <Layers className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Critical Thinking</CardTitle>
                    <CardDescription>Developing deeper understanding</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Methods for analyzing information, questioning assumptions, and forming reasoned arguments.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center mt-12">
                <Button size="lg" asChild>
                  <Link href="/assessment">Take the Assessment</Link>
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Discover your unique learning profile and get personalized recommendations
                </p>
              </div>
            </TabsContent>

            <TabsContent value="archetypes" className="mt-6">
              {/* Archetypes content would go here */}
              <h2 className="text-2xl font-bold mb-6">Learning Archetypes</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <Card className="border-blue-200 hover:border-blue-300">
                  <CardHeader className="pb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">The Organizer</CardTitle>
                    <CardDescription>Structured, methodical, and detail-oriented</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Excels at planning and structuring academic work with clear expectations and deadlines.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/resources/archetypes/organizer">
                        <span>Learn More</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                {/* Other archetype cards would be repeated here */}
              </div>
            </TabsContent>

            <TabsContent value="strategies" className="mt-6">
              {/* Strategies content would go here */}
              <h2 className="text-2xl font-bold mb-6">Study Strategies</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pomodoro Technique</CardTitle>
                    <CardDescription>Time management method</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Work in focused intervals (typically 25 minutes) followed by short breaks. After four intervals,
                      take a longer break.
                    </p>
                    <div className="text-sm">
                      <p className="font-medium">Best for:</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>The Organizer</li>
                        <li>The Deep Diver</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Feynman Technique</CardTitle>
                    <CardDescription>Concept mastery method</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Explain concepts in simple terms to identify knowledge gaps and deepen understanding.
                    </p>
                    <div className="text-sm">
                      <p className="font-medium">Best for:</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>The Deep Diver</li>
                        <li>The Reflective Thinker</li>
                        <li>The Collaborator</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Other strategy cards would be added here */}
              </div>
            </TabsContent>

            <TabsContent value="tools" className="mt-6">
              {/* Tools content would go here */}
              <h2 className="text-2xl font-bold mb-6">Tools & Templates</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Study Schedule Template</CardTitle>
                    <CardDescription>Weekly planning tool</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Customizable template for planning study sessions, assignments, and breaks throughout the week.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Download Template
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cornell Notes System</CardTitle>
                    <CardDescription>Note-taking method</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Structured note-taking format with sections for notes, cues, and summary to improve retention and
                      review.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Download Template
                    </Button>
                  </CardFooter>
                </Card>

                {/* Other tool cards would be added here */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
