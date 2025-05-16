"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Calendar, BarChart3 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AvatarSelector } from "@/components/avatar-selector"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { archetypes } from "@/data/archetypes"

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth()
  const { toast } = useToast()

  const [name, setName] = useState(user?.name || "")
  const [academicLevel, setAcademicLevel] = useState(user?.academicLevel || "")
  const [institution, setInstitution] = useState(user?.institution || "")
  const [fieldOfStudy, setFieldOfStudy] = useState(user?.fieldOfStudy || "")
  const [profileImage, setProfileImage] = useState(user?.profileImage || null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await updateProfile({
        name,
        academicLevel,
        institution,
        fieldOfStudy,
        profileImage,
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

  const handleAvatarChange = (avatarUrl: string) => {
    setProfileImage(avatarUrl)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="mb-6">You need to be signed in to view your profile.</p>
          <Link href="/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </>
    )
  }

  // Sort assessment results by date (newest first)
  const sortedResults = [...(user.assessmentResults || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <Card className="border-none shadow-lg">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <AvatarSelector currentAvatar={profileImage} onAvatarChange={handleAvatarChange} name={user.name} />
                  </div>
                  <CardTitle>{user.name || "User"}</CardTitle>
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
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => updateProfile({ profileImage })}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Avatar"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="md:w-2/3">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="profile">Profile Information</TabsTrigger>
                  <TabsTrigger value="assessment">Assessment History</TabsTrigger>
                </TabsList>

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

                <TabsContent value="assessment" className="mt-6">
                  <Card className="border-none shadow-lg">
                    <CardHeader>
                      <CardTitle>Assessment History</CardTitle>
                      <CardDescription>View your previous assessment results</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {sortedResults.length > 0 ? (
                        <div className="space-y-4">
                          {sortedResults.map((result) => {
                            const primaryArchetype = archetypes[result.primaryArchetype]
                            return (
                              <Card key={result.id} className="overflow-hidden">
                                <div
                                  className={`bg-${primaryArchetype?.color || "blue"}-50 px-4 py-3 border-b flex justify-between items-center`}
                                >
                                  <div className="flex items-center">
                                    <div
                                      className={`w-8 h-8 rounded-full bg-${primaryArchetype?.color || "blue"}-100 flex items-center justify-center mr-3`}
                                    >
                                      <BarChart3 className={`h-4 w-4 text-${primaryArchetype?.color || "blue"}-500`} />
                                    </div>
                                    <div>
                                      <h4 className="font-medium">{primaryArchetype?.title || "Assessment Result"}</h4>
                                      <div className="flex items-center text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {formatDate(result.date)}
                                      </div>
                                    </div>
                                  </div>
                                  <Badge variant="outline">
                                    {result.archetypeScores.find((score) => score.id === result.primaryArchetype)
                                      ?.match || 0}
                                    % Match
                                  </Badge>
                                </div>
                                <CardContent className="p-4">
                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground mb-1">
                                        Primary Archetype
                                      </p>
                                      <p>{primaryArchetype?.title || result.primaryArchetype}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground mb-1">
                                        Secondary Archetype
                                      </p>
                                      <p>{archetypes[result.secondaryArchetype]?.title || result.secondaryArchetype}</p>
                                    </div>
                                  </div>

                                  <div className="mb-4">
                                    <p className="text-sm font-medium text-muted-foreground mb-2">Top Dimensions</p>
                                    <div className="grid grid-cols-2 gap-2">
                                      {result.dimensions
                                        .sort((a, b) => b.score - a.score)
                                        .slice(0, 4)
                                        .map((dim, index) => {
                                          const dimensionName = dim.dimension.split(" vs. ")[0]
                                          return (
                                            <div key={index} className="flex items-center">
                                              <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                                              <span className="text-sm">
                                                {dimensionName}: {dim.score}%
                                              </span>
                                            </div>
                                          )
                                        })}
                                    </div>
                                  </div>

                                  <Link href={`/results/history/${result.id}`}>
                                    <Button variant="outline" size="sm" className="w-full">
                                      View Full Results
                                    </Button>
                                  </Link>
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">You haven't taken any assessments yet.</p>
                          <Button className="mt-4" asChild>
                            <Link href="/assessment">Take Assessment</Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <p className="text-sm text-muted-foreground">
                        {sortedResults.length > 0
                          ? `You have completed ${sortedResults.length} assessment${sortedResults.length > 1 ? "s" : ""}.`
                          : ""}
                      </p>
                      {sortedResults.length > 0 && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/assessment">Take New Assessment</Link>
                        </Button>
                      )}
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
