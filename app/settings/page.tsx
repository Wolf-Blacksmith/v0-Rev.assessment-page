"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function SettingsPage() {
  const { user, loading, updatePassword, resetPassword, deleteAccount, signOut } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [assessmentReminders, setAssessmentReminders] = useState(true)
  const [resourceUpdates, setResourceUpdates] = useState(true)

  // Privacy settings
  const [shareResults, setShareResults] = useState(false)
  const [anonymousData, setAnonymousData] = useState(true)

  // Appearance settings
  const [darkMode, setDarkMode] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState("medium")

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")

    // Validate passwords
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    try {
      setPasswordLoading(true)
      await updatePassword(newPassword)

      // Reset form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully",
      })
    } catch (error: any) {
      setPasswordError(error.message || "Failed to update password")
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!user?.email) return

    try {
      await resetPassword(user.email)
    } catch (error) {
      // Error is handled in the auth context
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      toast({
        title: "Error",
        description: "Please type DELETE to confirm account deletion",
        variant: "destructive",
      })
      return
    }

    try {
      setDeleteLoading(true)
      await deleteAccount()
      setDeleteDialogOpen(false)
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleSaveNotificationSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your notification settings have been updated",
    })
  }

  const handleSavePrivacySettings = () => {
    toast({
      title: "Settings saved",
      description: "Your privacy settings have been updated",
    })
  }

  const handleSaveAppearanceSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your appearance settings have been updated",
    })
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="mb-6">You need to be signed in to view your settings.</p>
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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>

          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>View and manage your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={user.email} disabled />
                    </div>
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={user.name || ""} disabled />
                      <p className="text-xs text-muted-foreground mt-1">
                        To update your name, go to your{" "}
                        <Link href="/profile" className="text-primary hover:underline">
                          profile
                        </Link>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    {passwordError && (
                      <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">{passwordError}</div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={passwordLoading}>
                      {passwordLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <p className="text-sm text-muted-foreground">Forgot your password?</p>
                  <Button variant="outline" onClick={handleResetPassword}>
                    Reset Password
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions for your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      Deleting your account will remove all your data, including assessment results and profile
                      information. This action cannot be undone.
                    </p>
                    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="destructive">Delete Account</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center text-red-600">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            Delete Account
                          </DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove all your
                            data from our servers.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <p className="text-sm font-medium">To confirm, type "DELETE" in the field below:</p>
                          <Input
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            placeholder="Type DELETE to confirm"
                          />
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={deleteConfirmation !== "DELETE" || deleteLoading}
                          >
                            {deleteLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              "Delete Account"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>Manage how and when you receive emails from us</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive important updates about your account and assessments
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="assessment-reminders">Assessment Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get reminders to complete assessments and track your progress
                      </p>
                    </div>
                    <Switch
                      id="assessment-reminders"
                      checked={assessmentReminders}
                      onCheckedChange={setAssessmentReminders}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="resource-updates">Resource Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about new learning resources and study tips
                      </p>
                    </div>
                    <Switch id="resource-updates" checked={resourceUpdates} onCheckedChange={setResourceUpdates} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveNotificationSettings}>Save Notification Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control how your data is used and shared</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="share-results">Share Assessment Results</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow your assessment results to be shared with your institution
                      </p>
                    </div>
                    <Switch id="share-results" checked={shareResults} onCheckedChange={setShareResults} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="anonymous-data">Anonymous Data Collection</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow anonymous data to be used for research and platform improvement
                      </p>
                    </div>
                    <Switch id="anonymous-data" checked={anonymousData} onCheckedChange={setAnonymousData} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSavePrivacySettings}>Save Privacy Settings</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Manage your personal data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">
                    You can request a copy of your data or delete specific assessment results from your profile page.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline">Download My Data</Button>
                    <Link href="/profile?tab=assessment">
                      <Button variant="outline">Manage Assessment Results</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Display Settings</CardTitle>
                  <CardDescription>Customize how the application looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
                    </div>
                    <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="high-contrast">High Contrast</Label>
                      <p className="text-sm text-muted-foreground">Increase contrast for better readability</p>
                    </div>
                    <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <Button
                        variant={fontSize === "small" ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setFontSize("small")}
                      >
                        Small
                      </Button>
                      <Button
                        variant={fontSize === "medium" ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setFontSize("medium")}
                      >
                        Medium
                      </Button>
                      <Button
                        variant={fontSize === "large" ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setFontSize("large")}
                      >
                        Large
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveAppearanceSettings}>Save Appearance Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
