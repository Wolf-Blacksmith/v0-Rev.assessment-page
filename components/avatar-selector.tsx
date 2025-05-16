"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Predefined avatar options
const avatarOptions = [
  "/avatars/avatar-1.png",
  "/avatars/avatar-2.png",
  "/avatars/avatar-3.png",
  "/avatars/avatar-4.png",
  "/avatars/avatar-5.png",
  "/avatars/avatar-6.png",
  "/avatars/avatar-7.png",
  "/avatars/avatar-8.png",
]

// For demo purposes, we'll use placeholder.svg with different colors
const generatePlaceholderAvatar = (index: number) => {
  const colors = [
    "4f46e5", // indigo
    "0ea5e9", // sky
    "10b981", // emerald
    "f59e0b", // amber
    "ef4444", // red
    "8b5cf6", // violet
    "ec4899", // pink
    "6366f1", // indigo-light
  ]
  return `/placeholder.svg?height=80&width=80&text=${index + 1}&bg=${colors[index % colors.length]}`
}

interface AvatarSelectorProps {
  currentAvatar: string | null
  onAvatarChange: (avatarUrl: string) => void
  name?: string | null
}

export function AvatarSelector({ currentAvatar, onAvatarChange, name }: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(currentAvatar)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl)
  }

  const handleSaveAvatar = () => {
    if (selectedAvatar) {
      onAvatarChange(selectedAvatar)
      setIsDialogOpen(false)
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      })
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, we would upload this file to a server
      // For this demo, we'll use a FileReader to get a data URL
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedAvatar(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="flex flex-col items-center">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="relative cursor-pointer group">
            <Avatar className="h-24 w-24 border-2 border-muted">
              <AvatarImage src={currentAvatar || undefined} alt={name || "User"} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="h-8 w-8 text-white" />
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Profile Picture</DialogTitle>
            <DialogDescription>Select from our preset avatars or upload your own image.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="preset" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preset">Preset Avatars</TabsTrigger>
              <TabsTrigger value="upload">Upload Image</TabsTrigger>
            </TabsList>

            <TabsContent value="preset" className="mt-4">
              <div className="grid grid-cols-4 gap-4">
                {avatarOptions.map((avatar, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer rounded-full overflow-hidden border-2 transition-all ${
                      selectedAvatar === generatePlaceholderAvatar(index)
                        ? "border-primary scale-105"
                        : "border-transparent hover:border-muted"
                    }`}
                    onClick={() => handleAvatarSelect(generatePlaceholderAvatar(index))}
                  >
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={generatePlaceholderAvatar(index) || "/placeholder.svg"}
                        alt={`Avatar option ${index + 1}`}
                      />
                      <AvatarFallback>{index + 1}</AvatarFallback>
                    </Avatar>
                    {selectedAvatar === generatePlaceholderAvatar(index) && (
                      <div className="absolute inset-0 bg-primary/20 rounded-full flex items-center justify-center">
                        <div className="h-5 w-5 rounded-full bg-primary"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upload" className="mt-4">
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg">
                {selectedAvatar && selectedAvatar.startsWith("data:") ? (
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={selectedAvatar || "/placeholder.svg"} alt="Uploaded avatar" />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => setSelectedAvatar(currentAvatar)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center mb-4">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Drag and drop an image, or click to browse</p>
                  </div>
                )}
                <input type="file" id="avatar-upload" accept="image/*" className="hidden" onChange={handleFileUpload} />
                <label htmlFor="avatar-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>Choose Image</span>
                  </Button>
                </label>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAvatar} disabled={!selectedAvatar}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <p className="text-sm text-muted-foreground mt-2">Click to change profile picture</p>
    </div>
  )
}
