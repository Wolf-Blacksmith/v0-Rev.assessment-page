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
import { Loader2 } from "lucide-react"
import { AvatarSelector } from "@/components/avatar-selector"

export default function ProfileSetupPage() {
  const { user, updateProfile, loading } = useAuth()
  const router = useRouter()
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
        description: "Your profile has been set up successfully!",
      })

      router.push("/dashboard")
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

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="border-none shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Set Up Your Profile</CardTitle>
              <CardDescription className="text-center">
                Tell us a bit about yourself to personalize your experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center mb-6">
                  <AvatarSelector currentAvatar={profileImage} onAvatarChange={handleAvatarChange} name={name} />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="academic-level">Academic Level</Label>
                    <Select value={academicLevel} onValueChange={setAcademicLevel} required>
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
                      placeholder="University of Example"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Optional</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="field-of-study">Field of Study</Label>
                    <Input
                      id="field-of-study"
                      placeholder="Computer Science, Biology, etc."
                      value={fieldOfStudy}
                      onChange={(e) => setFieldOfStudy(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Optional</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    This information helps us provide more relevant recommendations based on your academic context.
                  </p>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Complete Profile Setup"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}
