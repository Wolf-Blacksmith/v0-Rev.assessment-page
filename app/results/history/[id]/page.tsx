"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { archetypes } from "@/data/archetypes"
import { RadarChart } from "@/components/radar-chart"
import {
  Download,
  Share2,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Users,
  Calendar,
  RefreshCw,
  Brain,
  ArrowLeft,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { AssessmentResult } from "@/lib/auth-context"

// Reuse the function from results page
function getDimensionColors(dimension: string): { positive: string; negative: string } {
  // Map dimensions to color schemes
  const colorMap: Record<string, { positive: string; negative: string }> = {
    "Self-Regulation vs. Impulsivity": {
      positive: "bg-green-100 text-green-800 border-green-200",
      negative: "bg-red-100 text-red-800 border-red-200",
    },
    "Time Management vs. Time Urgency": {
      positive: "bg-blue-100 text-blue-800 border-blue-200",
      negative: "bg-orange-100 text-orange-800 border-orange-200",
    },
    "Task Management vs. Task Reactivity": {
      positive: "bg-indigo-100 text-indigo-800 border-indigo-200",
      negative: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    "Metacognitive Monitoring vs. Blind Execution": {
      positive: "bg-purple-100 text-purple-800 border-purple-200",
      negative: "bg-gray-100 text-gray-800 border-gray-200",
    },
    "Concentration vs. Distractibility": {
      positive: "bg-teal-100 text-teal-800 border-teal-200",
      negative: "bg-pink-100 text-pink-800 border-pink-200",
    },
    "Digital Literacy vs. Digital Overload": {
      positive: "bg-cyan-100 text-cyan-800 border-cyan-200",
      negative: "bg-red-100 text-red-800 border-red-200",
    },
    "Collaboration vs. Independence": {
      positive: "bg-emerald-100 text-emerald-800 border-emerald-200",
      negative: "bg-blue-100 text-blue-800 border-blue-200",
    },
    "Adaptability vs. Rigidity": {
      positive: "bg-amber-100 text-amber-800 border-amber-200",
      negative: "bg-slate-100 text-slate-800 border-slate-200",
    },
    "Structured Note-Taking vs. Unstructured Capture": {
      positive: "bg-lime-100 text-lime-800 border-lime-200",
      negative: "bg-gray-100 text-gray-800 border-gray-200",
    },
    "Retention vs. Cramming": {
      positive: "bg-violet-100 text-violet-800 border-violet-200",
      negative: "bg-orange-100 text-orange-800 border-orange-200",
    },
    "Critical Thinking vs. Surface Learning": {
      positive: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
      negative: "bg-gray-100 text-gray-800 border-gray-200",
    },
    "Well-being Management vs. Burnout Vulnerability": {
      positive: "bg-emerald-100 text-emerald-800 border-emerald-200",
      negative: "bg-red-100 text-red-800 border-red-200",
    },
  }

  return (
    colorMap[dimension] || {
      positive: "bg-gray-100 text-gray-800 border-gray-200",
      negative: "bg-gray-100 text-gray-800 border-gray-200",
    }
  )
}

export default function HistoricalResultPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/signin")
      return
    }

    const resultId = Array.isArray(id) ? id[0] : id
    const foundResult = user.assessmentResults.find((r) => r.id === resultId)

    if (foundResult) {
      setResult(foundResult)
    }

    setLoading(false)
  }, [id, user, router])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading...</p>
        </div>
      </>
    )
  }

  if (!result) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Result Not Found</h1>
          <p className="mb-6">Sorry, we couldn't find the assessment result you're looking for.</p>
          <Link href="/profile">
            <Button>Return to Profile</Button>
          </Link>
        </div>
      </>
    )
  }

  const primaryArchetype = archetypes[result.primaryArchetype]
  const secondaryArchetype = archetypes[result.secondaryArchetype]

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  // Get icon component based on archetype
  const getArchetypeIcon = (iconName: string) => {
    const icons = {
      calendar: <Calendar className="h-full w-full" />,
      "book-open": <BookOpen className="h-full w-full" />,
      users: <Users className="h-full w-full" />,
      "refresh-cw": <RefreshCw className="h-full w-full" />,
      brain: <Brain className="h-full w-full" />,
    }
    return icons[iconName as keyof typeof icons] || <BookOpen className="h-full w-full" />
  }

  // Format dimension names for display
  const formatDimension = (dimension: string) => {
    const [positive, negative] = dimension.split(" vs. ")
    return { positive, negative }
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">Assessment Result</h1>
                <p className="text-muted-foreground">Completed on {formatDate(result.date)}</p>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {primaryArchetype.title}
              </Badge>
            </div>
          </div>

          {/* Primary Archetype Card */}
          <Card className="border-none shadow-lg mb-8 overflow-hidden">
            <CardHeader className={`bg-${primaryArchetype.color}-100 border-b text-center py-8`}>
              <div className="mx-auto w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center mb-4">
                <div className={`h-12 w-12 text-${primaryArchetype.color}-500`}>
                  {getArchetypeIcon(primaryArchetype.icon)}
                </div>
              </div>
              <CardTitle className="text-2xl md:text-3xl">{primaryArchetype.title}</CardTitle>
              <CardDescription className="text-lg mt-2">{primaryArchetype.tagline}</CardDescription>
              <div className="mt-4">
                <Badge variant="outline" className="text-sm">
                  Primary Archetype •{" "}
                  {result.archetypeScores.find((score) => score.id === result.primaryArchetype)?.match || 0}% Match
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <p className="mb-8 text-lg leading-relaxed">{primaryArchetype.description}</p>

              <Tabs defaultValue="strengths" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="strengths" className="text-sm md:text-base">
                    Strengths
                  </TabsTrigger>
                  <TabsTrigger value="challenges" className="text-sm md:text-base">
                    Challenges
                  </TabsTrigger>
                  <TabsTrigger value="techniques" className="text-sm md:text-base">
                    Techniques
                  </TabsTrigger>
                  <TabsTrigger value="tools" className="text-sm md:text-base">
                    Tools
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="strengths" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Dominant Strengths</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {primaryArchetype.dominantStrengths.map((strength, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Natural Environments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {primaryArchetype.naturalEnvironments.map((env, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{env}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="challenges" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Academic Challenges</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {primaryArchetype.academicChallenges.map((challenge, index) => (
                            <li key={index} className="flex items-start">
                              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{challenge}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Development Focus</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {primaryArchetype.developmentFocus.map((focus, index) => (
                            <li key={index} className="flex items-start">
                              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{focus}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="techniques" className="mt-0">
                  <div className="space-y-4">
                    {primaryArchetype.techniques.map((technique, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{technique.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-1">Implementation</h4>
                            <p>{technique.implementation}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-1">Evidence Base</h4>
                            <p className="text-sm">{technique.evidenceBase}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="tools" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Recommended Tools</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-1">
                              For Undergraduate Students
                            </h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {primaryArchetype.tools.undergraduate.map((tool, index) => (
                                <li key={index}>{tool}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-1">For Graduate Students</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {primaryArchetype.tools.graduate.map((tool, index) => (
                                <li key={index}>{tool}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-1">Low-Tech Alternatives</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {primaryArchetype.tools.lowTech.map((tool, index) => (
                                <li key={index}>{tool}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Integration Strategies</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {primaryArchetype.integrationStrategies.map((strategy, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{strategy}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-medium text-sm text-muted-foreground mb-1">
                            Accessibility Considerations
                          </h4>
                          <p className="text-sm">{primaryArchetype.tools.accessibility}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Dimension Scores */}
          <Card className="border-none shadow-lg mb-8 overflow-hidden">
            <CardHeader className="bg-primary/5 border-b text-center py-8">
              <CardTitle className="text-2xl md:text-3xl">Study Habits Profile</CardTitle>
              <CardDescription className="text-lg mt-2">
                Your scores across 12 key dimensions of effective studying
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="w-full h-[500px] mb-8">
                <RadarChart data={result.dimensions} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.dimensions.map((dim, index) => {
                  const { positive, negative } = formatDimension(dim.dimension)
                  const colors = getDimensionColors(dim.dimension)
                  return (
                    <Card key={index} className="border shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{dim.dimension}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-2">
                          <div className="flex justify-between mb-1">
                            <span className={`text-sm font-medium px-2 py-1 rounded-md ${colors.negative}`}>
                              {negative}
                            </span>
                            <span className={`text-sm font-medium px-2 py-1 rounded-md ${colors.positive}`}>
                              {positive}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden mt-2">
                            <div
                              className="h-full bg-gradient-to-r from-red-400 to-green-400"
                              style={{ width: `${dim.score}%` }}
                            ></div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                          {dim.score > 75
                            ? `You show strong ${positive} tendencies. This is a significant strength in your study approach.`
                            : dim.score > 50
                              ? `You lean toward ${positive}, but have some ${negative} tendencies as well.`
                              : dim.score > 25
                                ? `You tend to show more ${negative} characteristics, with some ${positive} tendencies.`
                                : `You demonstrate strong ${negative} tendencies. This may be an area to focus on improving.`}
                        </p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Archetype Distribution */}
          <Card className="border-none shadow-lg mb-8 overflow-hidden">
            <CardHeader className="bg-primary/5 border-b py-6">
              <CardTitle className="text-xl">Your Archetype Distribution</CardTitle>
              <CardDescription>Most students display characteristics of multiple archetypes</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {result.archetypeScores.map((score) => {
                  const archetype = archetypes[score.id]
                  return (
                    <div key={score.id} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full bg-${archetype.color}-100 flex items-center justify-center mr-3`}
                      >
                        <div className={`h-4 w-4 text-${archetype.color}-500`}>{getArchetypeIcon(archetype.icon)}</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{archetype.title}</span>
                          <span className="text-sm">{score.match}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-${archetype.color}-500`}
                            style={{ width: `${score.match}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 px-6 py-4 text-sm text-muted-foreground">
              <p>
                Approximately 65% of students display characteristics of multiple archetypes. Your results show your
                unique blend of learning preferences.
              </p>
            </CardFooter>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Results
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share Results
            </Button>
            <Link href="/profile">
              <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">Back to Profile</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
