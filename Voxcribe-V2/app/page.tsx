"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Mic,
  Square,
  Search,
  FileText,
  Download,
  Trash2,
  Clock,
  User,
  Sparkles,
  Upload,
  Volume2,
  Sun,
  Moon,
  Bookmark,
  ArrowRight,
  Phone,
  UserPlus,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Note {
  id: string
  title: string
  content: string
  summary: string
  duration: string
  createdAt: string
  tags: string[]
  speaker?: string
  isBookmarked?: boolean
}

export default function VoiceToNotesApp() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showSignUp, setShowSignUp] = useState(false)
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  })

  const intervalRef = useRef<NodeJS.Timeout>()

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Add this after the isDarkMode state
  const [bookmarkedNotes, setBookmarkedNotes] = useState<Set<string>>(new Set(["1"]))

  // Mock notes data
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Team Meeting - Project Planning",
      content:
        "Discussed the upcoming product launch timeline. Key points covered include market research findings, target demographics, and budget allocation. The team agreed on a phased approach to development.",
      summary: "Product launch planning meeting covering research, demographics, and phased development approach.",
      duration: "15:32",
      createdAt: new Date().toISOString().split("T")[0], // Today's date
      tags: ["meeting", "planning", "product"],
      speaker: "Sarah Johnson",
      isBookmarked: true,
    },
    {
      id: "2",
      title: "Lecture - Machine Learning Basics",
      content:
        "Introduction to supervised and unsupervised learning algorithms. Covered linear regression, decision trees, and clustering methods with practical examples.",
      summary: "ML fundamentals: supervised/unsupervised learning, regression, decision trees, clustering.",
      duration: "45:18",
      createdAt: "2024-01-14",
      tags: ["lecture", "AI", "education"],
      speaker: "Dr. Michael Chen",
      isBookmarked: false,
    },
  ])

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRecording])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    setIsProcessing(true)

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      // Add new note (mock)
      const newNote: Note = {
        id: Date.now().toString(),
        title: "New Recording",
        content: "This is a sample transcription of your recording...",
        summary: "Sample summary of the recorded content.",
        duration: formatTime(recordingTime),
        createdAt: new Date().toISOString().split("T")[0],
        tags: ["recording", "new"],
        speaker: "You",
      }
      setNotes((prev) => [newNote, ...prev])
      setRecordingTime(0)
    }, 3000)
  }

  const toggleBookmark = (noteId: string) => {
    setBookmarkedNotes((prev) => {
      const newBookmarks = new Set(prev)
      if (newBookmarks.has(noteId)) {
        newBookmarks.delete(noteId)
      } else {
        newBookmarks.add(noteId)
      }
      return newBookmarks
    })

    setNotes((prev) =>
      prev.map((note) => (note.id === noteId ? { ...note, isBookmarked: !bookmarkedNotes.has(noteId) } : note)),
    )
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const todayNotes = notes.filter((note) => note.createdAt === new Date().toISOString().split("T")[0])

  const handleGetStarted = () => {
    setShowWelcome(false)
    setShowAuth(true)
  }

  const handleBackToWelcome = () => {
    setShowAuth(false)
    setShowWelcome(true)
  }

  const handleContinueAsGuest = () => {
    setShowAuth(false)
    setShowWelcome(false)
    setShowSignUp(false) // Make sure sign-up is not shown
  }

  const handleGoogleLogin = () => {
    // Simulate Google login
    setTimeout(() => {
      setShowAuth(false)
      setShowWelcome(false)
      setShowSignUp(false) // Add this line
    }, 1000)
  }

  const handlePhoneLogin = () => {
    // Simulate phone login
    setTimeout(() => {
      setShowAuth(false)
      setShowWelcome(false)
      setShowSignUp(false) // Add this line
    }, 1000)
  }

  const handleShowSignUp = () => {
    setShowSignUp(true)
    setShowAuth(false) // Add this line to hide the auth screen
  }

  const handleBackToAuth = () => {
    setShowSignUp(false)
    setShowAuth(true) // Add this line to show the auth screen again
    setSignUpData({ fullName: "", email: "", phoneNumber: "" })
  }

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate sign-up process
    console.log("Sign up data:", signUpData)
    setTimeout(() => {
      setShowAuth(false)
      setShowWelcome(false)
      setShowSignUp(false)
    }, 1000)
  }

  const handleInputChange = (field: string, value: string) => {
    setSignUpData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Welcome Screen Component
  if (showWelcome) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center transition-all duration-500",
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-slate-900 to-black"
            : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100",
        )}
      >
        {/* Theme Toggle for Welcome Screen */}
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className={cn(
              "transition-all duration-300",
              isDarkMode
                ? "border-gray-600 bg-gray-800/70 text-gray-200 hover:bg-gray-700 hover:text-white hover:border-gray-500"
                : "border-gray-400 bg-gray-200/70 text-gray-800 hover:bg-gray-300 hover:border-gray-500",
            )}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 mr-2" />
                Light
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 mr-2" />
                Dark
              </>
            )}
          </Button>
        </div>

        <div className="text-center space-y-6 px-4 max-w-2xl mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Volume2 className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Welcome Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              WELCOME TO
            </h1>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              VOXCRIBE :)
            </h2>
          </div>

          {/* Caption */}
          <p
            className={cn(
              "text-2xl md:text-3xl font-light tracking-wide",
              isDarkMode ? "text-gray-300" : "text-gray-700",
            )}
          >
            Transcription made easy
          </p>

          {/* Get Started Button */}
          <div className="pt-8">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Powered by Badge */}
          <div className="pt-4">
            <div
              className={cn(
                "inline-flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-sm border text-sm",
                isDarkMode
                  ? "bg-gray-900/50 border-gray-800 text-gray-400"
                  : "bg-white/50 border-gray-200 text-gray-600",
              )}
            >
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
              <span>Powered by VOXCRIBE</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Auth Screen Component
  if (showAuth) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center transition-all duration-500",
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-slate-900 to-black"
            : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100",
        )}
      >
        {/* Theme Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className={cn(
              "transition-all duration-300",
              isDarkMode
                ? "border-gray-600 bg-gray-800/70 text-gray-200 hover:bg-gray-700 hover:text-white hover:border-gray-500"
                : "border-gray-400 bg-gray-200/70 text-gray-800 hover:bg-gray-300 hover:border-gray-500",
            )}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 mr-2" />
                Light
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 mr-2" />
                Dark
              </>
            )}
          </Button>
        </div>

        {/* Back Button */}
        <div className="fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToWelcome}
            className={cn(
              "transition-all duration-300",
              isDarkMode
                ? "border-gray-600 bg-gray-800/70 text-gray-200 hover:bg-gray-700 hover:text-white hover:border-gray-500"
                : "border-gray-400 bg-gray-200/70 text-gray-800 hover:bg-gray-300 hover:border-gray-500",
            )}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="w-full max-w-md mx-auto px-4">
          <Card
            className={cn(
              "shadow-2xl backdrop-blur-sm border transition-all duration-300",
              isDarkMode ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200",
            )}
          >
            <CardHeader className="text-center pb-6">
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Volume2 className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle
                className={cn(
                  "text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent",
                )}
              >
                Welcome to VOXCRIBE
              </CardTitle>
              <CardDescription className={cn(isDarkMode ? "text-gray-400" : "text-gray-600")}>
                Choose your preferred way to continue
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Google Login */}
              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                className={cn(
                  "w-full h-12 text-left justify-start space-x-3 transition-all duration-200 hover:scale-[1.02]",
                  isDarkMode
                    ? "border-gray-600 bg-gray-800/50 text-gray-200 hover:bg-gray-700 hover:text-white hover:border-gray-500"
                    : "border-gray-400 bg-gray-100/50 text-gray-800 hover:bg-gray-200 hover:border-gray-500",
                )}
              >
                <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
                <span className="flex-1">Continue with Google</span>
              </Button>

              {/* Phone Login */}
              <Button
                onClick={handlePhoneLogin}
                variant="outline"
                className={cn(
                  "w-full h-12 text-left justify-start space-x-3 transition-all duration-200 hover:scale-[1.02]",
                  isDarkMode
                    ? "border-gray-600 bg-gray-800/50 text-gray-200 hover:bg-gray-700 hover:text-white hover:border-gray-500"
                    : "border-gray-400 bg-gray-100/50 text-gray-800 hover:bg-gray-200 hover:border-gray-500",
                )}
              >
                <Phone className="w-5 h-5 text-green-500" />
                <span className="flex-1">Continue with Phone Number</span>
              </Button>

              {/* Continue as Guest */}
              <Button
                onClick={handleContinueAsGuest}
                variant="outline"
                className={cn(
                  "w-full h-12 text-left justify-start space-x-3 transition-all duration-200 hover:scale-[1.02]",
                  isDarkMode
                    ? "border-gray-600 bg-gray-800/50 text-gray-200 hover:bg-gray-700 hover:text-white hover:border-gray-500"
                    : "border-gray-400 bg-gray-100/50 text-gray-800 hover:bg-gray-200 hover:border-gray-500",
                )}
              >
                <User className="w-5 h-5 text-blue-500" />
                <span className="flex-1">Continue as Guest</span>
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className={cn("absolute inset-0 flex items-center")}>
                  <span className={cn("w-full border-t", isDarkMode ? "border-gray-800" : "border-gray-200")} />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span
                    className={cn("px-2 text-xs", isDarkMode ? "bg-gray-900 text-gray-500" : "bg-white text-gray-500")}
                  >
                    New to VOXCRIBE?
                  </span>
                </div>
              </div>

              {/* Sign Up */}
              <Button
                onClick={handleShowSignUp}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-200 hover:scale-[1.02]"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Create New Account
              </Button>

              {/* Terms */}
              <p className={cn("text-xs text-center mt-4", isDarkMode ? "text-gray-500" : "text-gray-600")}>
                By continuing, you agree to our{" "}
                <span className="text-blue-500 hover:underline cursor-pointer">Terms of Service</span> and{" "}
                <span className="text-blue-500 hover:underline cursor-pointer">Privacy Policy</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Sign Up Screen Component
  if (showSignUp) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center transition-all duration-500",
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-slate-900 to-black"
            : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100",
        )}
      >
        {/* Theme Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className={cn(
              "transition-all duration-300",
              isDarkMode
                ? "border-gray-600 bg-gray-800/70 text-gray-200 hover:bg-gray-700 hover:text-white hover:border-gray-500"
                : "border-gray-400 bg-gray-200/70 text-gray-800 hover:bg-gray-300 hover:border-gray-500",
            )}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 mr-2" />
                Light
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 mr-2" />
                Dark
              </>
            )}
          </Button>
        </div>

        {/* Back Button */}
        <div className="fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToAuth}
            className={cn(
              "transition-all duration-300",
              isDarkMode
                ? "border-gray-600 bg-gray-800/70 text-gray-200 hover:bg-gray-700 hover:text-white hover:border-gray-500"
                : "border-gray-400 bg-gray-200/70 text-gray-800 hover:bg-gray-300 hover:border-gray-500",
            )}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="w-full max-w-md mx-auto px-4">
          <Card
            className={cn(
              "shadow-2xl backdrop-blur-sm border transition-all duration-300",
              isDarkMode ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200",
            )}
          >
            <CardHeader className="text-center pb-6">
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Volume2 className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle
                className={cn(
                  "text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent",
                )}
              >
                Create Your Account
              </CardTitle>
              <CardDescription className={cn(isDarkMode ? "text-gray-400" : "text-gray-600")}>
                Join VOXCRIBE and start transcribing today
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="fullName"
                    className={cn("text-sm font-medium", isDarkMode ? "text-gray-300" : "text-gray-700")}
                  >
                    Full Name
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={signUpData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    required
                    className={cn(
                      "h-12 transition-all duration-200",
                      isDarkMode
                        ? "border-gray-600 bg-gray-800/50 text-gray-200 placeholder:text-gray-500 focus:border-blue-500"
                        : "border-gray-400 bg-gray-100/50 text-gray-800 placeholder:text-gray-500 focus:border-blue-500",
                    )}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className={cn("text-sm font-medium", isDarkMode ? "text-gray-300" : "text-gray-700")}
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={signUpData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className={cn(
                      "h-12 transition-all duration-200",
                      isDarkMode
                        ? "border-gray-600 bg-gray-800/50 text-gray-200 placeholder:text-gray-500 focus:border-blue-500"
                        : "border-gray-400 bg-gray-100/50 text-gray-800 placeholder:text-gray-500 focus:border-blue-500",
                    )}
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label
                    htmlFor="phoneNumber"
                    className={cn("text-sm font-medium", isDarkMode ? "text-gray-300" : "text-gray-700")}
                  >
                    Phone Number
                  </label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={signUpData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    required
                    className={cn(
                      "h-12 transition-all duration-200",
                      isDarkMode
                        ? "border-gray-600 bg-gray-800/50 text-gray-200 placeholder:text-gray-500 focus:border-blue-500"
                        : "border-gray-400 bg-gray-100/50 text-gray-800 placeholder:text-gray-500 focus:border-blue-500",
                    )}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-200 hover:scale-[1.02] mt-6"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account
                </Button>

                {/* Terms */}
                <p className={cn("text-xs text-center mt-4", isDarkMode ? "text-gray-500" : "text-gray-600")}>
                  By creating an account, you agree to our{" "}
                  <span className="text-blue-500 hover:underline cursor-pointer">Terms of Service</span> and{" "}
                  <span className="text-blue-500 hover:underline cursor-pointer">Privacy Policy</span>
                </p>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className={cn("absolute inset-0 flex items-center")}>
                  <span className={cn("w-full border-t", isDarkMode ? "border-gray-800" : "border-gray-200")} />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span
                    className={cn("px-2 text-xs", isDarkMode ? "bg-gray-900 text-gray-500" : "bg-white text-gray-500")}
                  >
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Sign Up Options */}
              <div className="space-y-3">
                {/* Google Sign Up */}
                <Button
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className={cn(
                    "w-full h-12 text-left justify-start space-x-3 transition-all duration-200 hover:scale-[1.02]",
                    isDarkMode
                      ? "border-gray-600 bg-gray-800/50 text-gray-200 hover:bg-gray-700 hover:text-white hover:border-gray-500"
                      : "border-gray-400 bg-gray-100/50 text-gray-800 hover:bg-gray-200 hover:border-gray-500",
                  )}
                >
                  <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99
20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                  <span className="flex-1">Sign up with Google</span>
                </Button>

                {/* Phone Sign Up */}
                <Button
                  onClick={handlePhoneLogin}
                  variant="outline"
                  className={cn(
                    "w-full h-12 text-left justify-start space-x-3 transition-all duration-200 hover:scale-[1.02]",
                    isDarkMode
                      ? "border-gray-600 bg-gray-800/50 text-gray-200 hover:bg-gray-700 hover:text-white hover:border-gray-500"
                      : "border-gray-400 bg-gray-100/50 text-gray-800 hover:bg-gray-200 hover:border-gray-500",
                  )}
                >
                  <Phone className="w-5 h-5 text-green-500" />
                  <span className="flex-1">Sign up with Phone Number</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "min-h-screen transition-all duration-500",
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-black"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100",
      )}
    >
      {/* Header */}
      <header
        className={cn(
          "border-b backdrop-blur-sm sticky top-0 z-50 transition-all duration-300",
          isDarkMode ? "border-gray-800 bg-gray-900/80" : "border-gray-200 bg-white/80",
        )}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  VOXCRIBE :)
                </h1>
                <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-600")}>Transcription made easy</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant="secondary"
                className={cn(
                  isDarkMode
                    ? "bg-emerald-900/50 text-emerald-300 border-emerald-700"
                    : "bg-green-100 text-green-700 border-green-200",
                )}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className={cn(
                  "transition-all duration-300",
                  isDarkMode
                    ? "border-gray-600 bg-gray-800/70 text-gray-200 hover:bg-gray-700 hover:text-white hover:border-gray-500"
                    : "border-gray-400 bg-gray-200/70 text-gray-800 hover:bg-gray-300 hover:border-gray-500",
                )}
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-4 h-4 mr-2" />
                    Light
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 mr-2" />
                    Dark
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Powered by Voxcribe Bookmark */}
      <div className="fixed top-20 right-4 z-40">
        <div
          className={cn(
            "px-3 py-1.5 rounded-l-lg shadow-lg backdrop-blur-sm text-xs font-medium transition-all duration-300 border-l-4",
            isDarkMode
              ? "bg-gray-900/90 text-gray-300 border-purple-500 shadow-purple-500/20"
              : "bg-white/90 text-gray-600 border-purple-500 shadow-purple-500/10",
          )}
        >
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
            <span>Powered by VOXCRIBE</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recording Panel */}
          <div className="lg:col-span-1">
            <Card
              className={cn(
                "mb-6 shadow-2xl backdrop-blur-sm transition-all duration-300",
                isDarkMode ? "border-gray-800 bg-gray-900/70" : "border-gray-200 bg-white/70",
              )}
            >
              <CardHeader className="text-center pb-4">
                <CardTitle
                  className={cn(
                    "flex items-center justify-center space-x-2",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  <Mic className="w-5 h-5" />
                  <span>Voice Recording</span>
                </CardTitle>
                <CardDescription className={cn(isDarkMode ? "text-gray-400" : "text-gray-600")}>
                  Record your voice and get AI-powered transcription
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Recording Button */}
                <div className="flex flex-col items-center space-y-4">
                  <div
                    className={cn(
                      "relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300",
                      isRecording
                        ? "bg-red-500 shadow-lg shadow-red-500/30 animate-pulse"
                        : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30",
                    )}
                  >
                    <Button
                      size="lg"
                      className={cn(
                        "w-full h-full rounded-full border-4 border-gray-800",
                        isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700",
                      )}
                      onClick={isRecording ? handleStopRecording : handleStartRecording}
                      disabled={isProcessing}
                    >
                      {isRecording ? <Square className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
                    </Button>
                  </div>

                  <div className="text-center">
                    {isRecording && (
                      <div className="text-2xl font-mono font-bold text-red-400">{formatTime(recordingTime)}</div>
                    )}
                    {isProcessing && <div className="text-blue-400 font-medium">Processing... 🤖</div>}
                    <p className="text-sm text-gray-400 mt-1">
                      {isRecording ? "Recording in progress..." : "Click to start recording"}
                    </p>
                  </div>
                </div>

                {/* Upload Option */}
                <div className="border-t border-gray-800 pt-4">
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white",
                      isDarkMode ? "bg-transparent" : "bg-transparent",
                    )}
                    disabled={isRecording || isProcessing}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Audio File
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card
              className={cn(
                "shadow-2xl backdrop-blur-sm transition-all duration-300",
                isDarkMode ? "border-gray-800 bg-gray-900/70" : "border-gray-200 bg-white/70",
              )}
            >
              <CardHeader>
                <CardTitle className={cn("text-lg", isDarkMode ? "text-white" : "text-gray-900")}>
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-600")}>Total Notes</span>
                  <Badge
                    variant="secondary"
                    className={cn(isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-700")}
                  >
                    {notes.length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-600")}>Bookmarked</span>
                  <Badge
                    variant="secondary"
                    className={cn(isDarkMode ? "bg-yellow-900/50 text-yellow-300" : "bg-yellow-100 text-yellow-700")}
                  >
                    {bookmarkedNotes.size}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-600")}>This Day</span>
                  <Badge
                    variant="secondary"
                    className={cn(isDarkMode ? "bg-blue-900/50 text-blue-300" : "bg-blue-100 text-blue-700")}
                  >
                    {todayNotes.length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-600")}>This Week</span>
                  <Badge
                    variant="secondary"
                    className={cn(isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-700")}
                  >
                    2
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-600")}>Total Duration</span>
                  <Badge
                    variant="secondary"
                    className={cn(isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-700")}
                  >
                    1h 0m
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes List */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <Input
                    placeholder="Search notes, tags, or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      "pl-10 shadow-2xl backdrop-blur-sm",
                      isDarkMode
                        ? "border-gray-800 bg-gray-900/70 text-white placeholder:text-gray-500"
                        : "border-gray-300 bg-white/70 text-gray-900 placeholder:text-gray-500",
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredNotes.map((note) => (
                <Card
                  key={note.id}
                  className={cn(
                    "shadow-2xl backdrop-blur-sm cursor-pointer transition-all duration-300 hover:shadow-3xl hover:scale-[1.02] hover:border-blue-500/50",
                    isDarkMode
                      ? "border-gray-800 bg-gray-900/70 hover:bg-gray-800/70"
                      : "border-gray-300 bg-white/70 hover:bg-gray-100/70",
                    selectedNote?.id === note.id && "ring-2 ring-blue-500 scale-[1.03] shadow-3xl",
                  )}
                  onClick={() => setSelectedNote(note)}
                >
                  <CardHeader
                    className={cn("pb-3 transition-all duration-300", selectedNote?.id === note.id && "pb-4 px-6")}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <CardTitle
                            className={cn(
                              "text-lg transition-all duration-300",
                              isDarkMode ? "text-white" : "text-gray-900",
                              selectedNote?.id === note.id && "text-xl",
                              "group-hover:text-blue-400",
                            )}
                          >
                            {note.title}
                          </CardTitle>
                          {bookmarkedNotes.has(note.id) && (
                            <Bookmark
                              className={cn(
                                "w-4 h-4 text-yellow-500 fill-yellow-500 transition-all duration-300",
                                selectedNote?.id === note.id && "w-5 h-5",
                              )}
                            />
                          )}
                        </div>
                        <div
                          className={cn(
                            "flex items-center space-x-4 text-sm transition-all duration-300",
                            isDarkMode ? "text-gray-400" : "text-gray-600",
                            selectedNote?.id === note.id && "text-base space-x-6",
                          )}
                        >
                          <div className="flex items-center space-x-1">
                            <Clock
                              className={cn(
                                "w-4 h-4 transition-all duration-300",
                                selectedNote?.id === note.id && "w-5 h-5",
                              )}
                            />
                            <span>{note.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User
                              className={cn(
                                "w-4 h-4 transition-all duration-300",
                                selectedNote?.id === note.id && "w-5 h-5",
                              )}
                            />
                            <span>{note.speaker}</span>
                          </div>
                          <span>{note.createdAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className={cn(
                            "transition-all duration-300 opacity-70 hover:opacity-100",
                            isDarkMode
                              ? "text-gray-400 hover:text-white hover:bg-gray-800"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                            selectedNote?.id === note.id && "w-10 h-10 opacity-100",
                          )}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleBookmark(note.id)
                          }}
                        >
                          <Bookmark
                            className={cn(
                              "w-4 h-4 transition-all duration-300",
                              bookmarkedNotes.has(note.id) ? "text-yellow-500 fill-yellow-500" : "",
                              selectedNote?.id === note.id && "w-5 h-5",
                            )}
                          />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className={cn(
                            "transition-all duration-300 opacity-70 hover:opacity-100",
                            isDarkMode
                              ? "text-gray-400 hover:text-white hover:bg-gray-800"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                            selectedNote?.id === note.id && "w-10 h-10 opacity-100",
                          )}
                        >
                          <Download
                            className={cn(
                              "w-4 h-4 transition-all duration-300",
                              selectedNote?.id === note.id && "w-5 h-5",
                            )}
                          />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className={cn(
                            "transition-all duration-300 opacity-70 hover:opacity-100",
                            isDarkMode
                              ? "text-gray-400 hover:text-red-400 hover:bg-gray-800"
                              : "text-gray-600 hover:text-red-500 hover:bg-gray-100",
                            selectedNote?.id === note.id && "w-10 h-10 opacity-100",
                          )}
                        >
                          <Trash2
                            className={cn(
                              "w-4 h-4 transition-all duration-300",
                              selectedNote?.id === note.id && "w-5 h-5",
                            )}
                          />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent
                    className={cn(
                      "space-y-3 transition-all duration-300",
                      selectedNote?.id === note.id && "space-y-4 p-6",
                    )}
                  >
                    <div>
                      <h4
                        className={cn(
                          "font-medium text-sm mb-1 transition-all duration-300",
                          isDarkMode ? "text-gray-300" : "text-gray-700",
                          selectedNote?.id === note.id && "text-base mb-2",
                        )}
                      >
                        AI Summary
                      </h4>
                      <p
                        className={cn(
                          "text-sm p-3 rounded-lg transition-all duration-300",
                          isDarkMode
                            ? "text-gray-300 bg-blue-900/30 border border-blue-800/50"
                            : "text-gray-700 bg-blue-100/50 border border-blue-300/50",
                          selectedNote?.id === note.id && "text-base p-4",
                        )}
                      >
                        {note.summary}
                      </p>
                    </div>

                    {selectedNote?.id === note.id && (
                      <div className="border-t border-gray-800 pt-4 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                        <h4 className="font-medium text-base text-gray-300 mb-3">Full Transcription</h4>
                        <Textarea
                          value={note.content}
                          readOnly
                          className={cn(
                            "min-h-[150px] resize-none text-base leading-relaxed p-4 transition-all duration-300",
                            isDarkMode
                              ? "bg-gray-800 border-gray-700 text-gray-300"
                              : "bg-gray-50 border-gray-300 text-gray-700",
                          )}
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {note.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className={cn(
                            "text-xs transition-all duration-300",
                            isDarkMode
                              ? "border-gray-700 text-gray-400 hover:bg-gray-800"
                              : "border-gray-400 text-gray-600 hover:bg-gray-200",
                            selectedNote?.id === note.id && "text-sm px-3 py-1",
                          )}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredNotes.length === 0 && (
              <Card
                className={cn(
                  "shadow-2xl backdrop-blur-sm",
                  isDarkMode ? "border-gray-800 bg-gray-900/70" : "border-gray-300 bg-white/70",
                )}
              >
                <CardContent className="text-center py-12">
                  <FileText className={cn("w-12 h-12 mx-auto mb-4", isDarkMode ? "text-gray-600" : "text-gray-400")} />
                  <h3 className={cn("text-lg font-medium mb-2", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                    No notes found
                  </h3>
                  <p className={cn(isDarkMode ? "text-gray-500" : "text-gray-600")}>
                    {searchQuery ? "Try adjusting your search terms" : "Start by recording your first note"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
