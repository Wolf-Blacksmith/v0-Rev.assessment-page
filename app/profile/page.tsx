"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Loader2,
  Upload,
  Settings,
  LineChart,
  FileBarChartIcon as FileBar,
  BookOpen,
  Users,
  Calendar,
  RefreshCw,
  Brain,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { archetypes } from "@/data/archetypes"
import type { AssessmentResult } from "@/lib/auth-context"

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = useState(user?.name || "")
  const [academicLevel, setAcademicLevel] = useState(user?.academicLevel || "")
  const [institution, setInstitution] = useState(user?.institution || "")
  const [fieldOfStudy, setFieldOfStudy] = useState(user?.fieldOfStudy || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await updateProfile({
        name,
        academicLevel,
        institution,
        fieldOfStudy,
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully!",
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  // Function to get archetype icon
  const getArchetypeIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      calendar: <Calendar className="h-full w-full" />,
      "book-open": <BookOpen className="h-full w-full" />,
      users: <Users className="h-full w-full" />,
      "refresh-cw": <RefreshCw className="h-full w-full" />,
      brain: <Brain className="h-full w-full" />,
    }
    return icons[iconName] || <BookOpen className="h-full w-full" />
  }

  // Format date from ISO string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="mb-6">You need to be signed in to view your profile.</p>
          <Button onClick={() => router.push("/signin")}>Sign In</Button>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <Card className="border-none shadow-lg">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={user.profileImage || "/placeholder.svg?height=96&width=96"}
                        alt={user.displayName || user.name || "User"}
                      />
                      <AvatarFallback className="text-2xl">
                        {user.displayName?.[0] || user.name?.[0] || user.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle>{user.displayName || user.name || "User"}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Academic Level</p>
                      <p>{user.academicLevel || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Institution</p>
                      <p>{user.institution || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Field of Study</p>
                      <p>{user.fieldOfStudy || "Not specified"}</p>
                    </div>

                    {user.assessmentResults && user.assessmentResults.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Primary Learning Style</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="w-3 h-3 rounded-full bg-primary"></span>
                          <span>
                            {archetypes[user.assessmentResults[user.assessmentResults.length - 1].primaryArchetype]
                              ?.title || "Unknown"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <Button variant="secondary" className="w-full" onClick={() => router.push("/settings")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Settings
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="md:w-2/3">
              <Tabs defaultValue="assessment" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="assessment">Assessment History</TabsTrigger>
                  <TabsTrigger value="profile">Profile Information</TabsTrigger>
                </TabsList>

                <TabsContent value="assessment" className="mt-6">
                  <Card className="border-none shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <LineChart className="h-5 w-5" />
                        Assessment History
                      </CardTitle>
                      <CardDescription>View your previous assessment results</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {user.assessmentResults && user.assessmentResults.length > 0 ? (
                        <div className="space-y-6">
                          {user.assessmentResults.map((result: AssessmentResult, index: number) => {
                            const primaryArchetype = archetypes[result.primaryArchetype]
                            const secondaryArchetype = archetypes[result.secondaryArchetype]

                            if (!primaryArchetype) return null

                            return (
                              <Card key={index} className="overflow-hidden">
                                <CardHeader className={`bg-${primaryArchetype.color}-50 pb-4`}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`w-10 h-10 rounded-full bg-${primaryArchetype.color}-100 flex items-center justify-center`}
                                      >
                                        <div className={`h-5 w-5 text-${primaryArchetype.color}-500`}>
                                          {getArchetypeIcon(primaryArchetype.icon)}
                                        </div>
                                      </div>
                                      <div>
                                        <CardTitle className="text-lg">{primaryArchetype.title}</CardTitle>
                                        <p className="text-sm text-muted-foreground">{primaryArchetype.tagline}</p>
                                      </div>
                                    </div>
                                    <Badge variant="outline">
                                      {result.date ? formatDate(result.date) : "Recent Assessment"}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="py-4">
                                  <div className="space-y-4">
                                    <p className="text-sm">{primaryArchetype.description}</p>

                                    {secondaryArchetype && (
                                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                                        <div
                                          className={`w-8 h-8 rounded-full bg-${secondaryArchetype.color}-100 flex items-center justify-center`}
                                        >
                                          <div className={`h-4 w-4 text-${secondaryArchetype.color}-500`}>
                                            {getArchetypeIcon(secondaryArchetype.icon)}
                                          </div>
                                        </div>
                                        <div>
                                          <p className="font-medium">Secondary: {secondaryArchetype.title}</p>
                                          <p className="text-xs text-muted-foreground">{secondaryArchetype.tagline}</p>
                                        </div>
                                      </div>
                                    )}

                                    {result.dimensions && result.dimensions.length > 0 && (
                                      <div>
                                        <p className="font-medium text-sm mb-2">Top Dimensions:</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          {result.dimensions
                                            .sort((a, b) => b.score - a.score)
                                            .slice(0, 4)
                                            .map((dim, idx) => (
                                              <div key={idx} className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                                <span className="text-sm">
                                                  {dim.dimension.split(" vs. ")[0]}: {dim.score}%
                                                </span>
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                                <CardFooter className="bg-gray-50 py-3">
                                  <Button variant="outline" size="sm" asChild className="ml-auto">
                                    <Link
                                      href={`/results?data=${encodeURIComponent(
                                        JSON.stringify({
                                          dimensions: result.dimensions || [],
                                          primaryArchetype: result.primaryArchetype,
                                          secondaryArchetype: result.secondaryArchetype,
                                          archetypeScores: [],
                                        }),
                                      )}`}
                                    >
                                      View Full Results
                                    </Link>
                                  </Button>
                                </CardFooter>
                              </Card>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <FileBar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground mb-4">You haven't taken any assessments yet.</p>
                          <p className="text-sm text-muted-foreground mb-6">
                            Complete your first assessment to track your learning style!
                          </p>
                          <Button asChild>
                            <Link href="/assessment">Take Assessment</Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="profile" className="mt-6">
                  <Card className="border-none shadow-lg">
                    <CardHeader>
                      <CardTitle>Edit Profile</CardTitle>
                      <CardDescription>Update your profile information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="academic-level">Academic Level</Label>
                          <Select value={academicLevel} onValueChange={setAcademicLevel}>
                            <SelectTrigger id="academic-level">
                              <SelectValue placeholder="Select your academic level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high-school">High School</SelectItem>
                              <SelectItem value="undergraduate">Undergraduate</SelectItem>
                              <SelectItem value="graduate">Graduate</SelectItem>
                              <SelectItem value="doctoral">Doctoral</SelectItem>
                              <SelectItem value="professional">Professional</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="institution">Institution</Label>
                          <Input
                            id="institution"
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="field-of-study">Field of Study</Label>
                          <Input
                            id="field-of-study"
                            value={fieldOfStudy}
                            onChange={(e) => setFieldOfStudy(e.target.value)}
                          />
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
