"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { archetypes } from "@/data/archetypes"
import { RadarChart } from "@/components/radar-chart"
import { Download, Share2, CheckCircle, AlertCircle, BookOpen, Users, Calendar, RefreshCw, Brain } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"

interface DimensionResult {
  dimension: string
  score: number
}

interface ArchetypeScore {
  id: string
  score: number
  match: number
}

interface AssessmentResult {
  dimensions: DimensionResult[]
  primaryArchetype: string
  secondaryArchetype: string
  archetypeScores: ArchetypeScore[]
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const dataParam = searchParams.get("data")
  const { saveAssessmentResult, user } = useAuth()
  const { toast } = useToast()
  // Use a ref to track if we've already saved this result
  const resultSavedRef = useRef(false)

  let results: AssessmentResult = {
    dimensions: [],
    primaryArchetype: "organizer",
    secondaryArchetype: "deepDiver",
    archetypeScores: [],
  }

  try {
    if (dataParam) {
      results = JSON.parse(decodeURIComponent(dataParam))
    }
  } catch (error) {
    console.error("Failed to parse results data", error)
  }

  // Save the assessment result when component mounts, but only once
  useEffect(() => {
    // Only save if we have a user, results, and haven't saved yet
    if (user && results.dimensions.length > 0 && !resultSavedRef.current) {
      const resultToSave = {
        date: new Date().toISOString(),
        primaryArchetype: results.primaryArchetype,
        secondaryArchetype: results.secondaryArchetype,
        dimensions: results.dimensions,
      }

      // Mark as saved to prevent multiple saves
      resultSavedRef.current = true

      saveAssessmentResult(resultToSave).catch((err) => {
        console.error("Failed to save assessment result", err)
        // Reset the flag if saving fails
        resultSavedRef.current = false
      })
    }
  }, [user]) // Only depend on user, not on saveAssessmentResult or results

  const handleDownload = () => {
    // Create a blob with the results JSON
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    // Create temporary link element and trigger download
    const a = document.createElement("a")
    a.href = url
    a.download = `learning-assessment-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded Assessment Results",
      description: "Your results have been saved to your device.",
    })
  }

  const handleShare = () => {
    // In a real app, this would generate a shareable link
    // For now, we'll just copy the current URL to clipboard
    navigator.clipboard.writeText(window.location.href)

    toast({
      title: "Link Copied",
      description: "Assessment results link copied to clipboard!",
    })
  }

  if (!results.dimensions.length) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Result</h1>
          <p className="mb-6">Sorry, we couldn't find your assessment result.</p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </>
    )
  }

  const primaryArchetype = archetypes[results.primaryArchetype]
  const secondaryArchetype = archetypes[results.secondaryArchetype]

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
      <div className="hero-section">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Learning Profile</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Based on your responses, we've identified your learning archetype and study preferences
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
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
                  Primary Archetype • {results.archetypeScores[0]?.match || 0}% Match
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

          {/* Secondary Archetype Card */}
          <Card className="border-none shadow-lg mb-8 overflow-hidden">
            <CardHeader className={`bg-${secondaryArchetype.color}-50 border-b py-6`}>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mr-4">
                  <div className={`h-6 w-6 text-${secondaryArchetype.color}-500`}>
                    {getArchetypeIcon(secondaryArchetype.icon)}
                  </div>
                </div>
                <div>
                  <CardTitle className="text-xl">{secondaryArchetype.title}</CardTitle>
                  <CardDescription className="text-sm">{secondaryArchetype.tagline}</CardDescription>
                </div>
                <div className="ml-auto">
                  <Badge variant="outline" className="text-sm">
                    Secondary Archetype • {results.archetypeScores[1]?.match || 0}% Match
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm mb-4">{secondaryArchetype.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Dominant Strengths</h4>
                  <ul className="text-sm space-y-1">
                    {secondaryArchetype.dominantStrengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Development Focus</h4>
                  <ul className="text-sm space-y-1">
                    {secondaryArchetype.developmentFocus.map((focus, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{focus}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
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
                <RadarChart data={results.dimensions} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.dimensions.map((result, index) => {
                  const { positive, negative } = formatDimension(result.dimension)
                  return (
                    <Card key={index} className="border shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{result.dimension}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-2">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{negative}</span>
                            <span className="text-sm font-medium">{positive}</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${result.score}%` }}></div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                          {result.score > 75
                            ? `You show strong ${positive} tendencies. This is a significant strength in your study approach.`
                            : result.score > 50
                              ? `You lean toward ${positive}, but have some ${negative} tendencies as well.`
                              : result.score > 25
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
                {results.archetypeScores.map((score) => {
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
            <Button variant="outline" className="flex items-center gap-2" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              Download Results
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              Share Results
            </Button>
            <Link href="/assessment">
              <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">Retake Assessment</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
