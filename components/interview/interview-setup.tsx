"use client"

import React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { 
  MessageSquare, 
  Mic, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  Upload, 
  FileText,
  X,
  Briefcase,
  Building2,
  GraduationCap,
  Target,
  CheckCircle2,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useInterview } from "@/lib/interview-context"
import {
  type InterviewMode,
  type InterviewType,
  type DifficultyLevel,
  interviewTypes,
  difficultyLevels,
  experienceLevels,
  industries,
  popularRoles,
  focusAreaOptions
} from "@/lib/interview-types"

export function InterviewSetup() {
  const router = useRouter()
  const { setConfig, setQuestions, setIsInterviewActive, setStartTime } = useInterview()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  // Form state
  const [mode, setMode] = useState<InterviewMode>("text")
  const [type, setType] = useState<InterviewType>("behavioral")
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("intermediate")
  const [role, setRole] = useState("")
  const [company, setCompany] = useState("")
  const [industry, setIndustry] = useState("")
  const [experience, setExperience] = useState(experienceLevels[1])
  const [questionCount, setQuestionCount] = useState(5)
  const [resumeText, setResumeText] = useState("")
  const [resumeFileName, setResumeFileName] = useState("")
  const [skills, setSkills] = useState("")
  const [focusAreas, setFocusAreas] = useState<string[]>([])

  const modes = [
    { 
      value: "text" as InterviewMode, 
      label: "Text Interview", 
      icon: MessageSquare, 
      description: "Type your responses thoughtfully. Ideal for practicing structured answers.",
      features: ["Time to compose answers", "Edit before submitting", "Written communication practice"]
    },
    { 
      value: "voice" as InterviewMode, 
      label: "Voice Interview", 
      icon: Mic, 
      description: "Speak naturally as you would in a real interview. Practice verbal communication.",
      features: ["Real-time speech recognition", "Natural conversation flow", "Verbal articulation practice"]
    }
  ]

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setResumeFileName(file.name)
    
    // For now, we'll just read text files. In production, you'd use a PDF parser
    if (file.type === "text/plain") {
      const text = await file.text()
      setResumeText(text)
    } else if (file.type === "application/pdf") {
      // Placeholder for PDF parsing - in production use pdf-parse or similar
      setResumeText(`[Resume uploaded: ${file.name}]`)
    } else {
      // Try to read as text
      try {
        const text = await file.text()
        setResumeText(text)
      } catch {
        setResumeText(`[Resume uploaded: ${file.name}]`)
      }
    }
  }

  const removeResume = () => {
    setResumeFileName("")
    setResumeText("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const toggleFocusArea = (area: string) => {
    if (focusAreas.includes(area)) {
      setFocusAreas(focusAreas.filter(a => a !== area))
    } else if (focusAreas.length < 5) {
      setFocusAreas([...focusAreas, area])
    }
  }

  const handleStartInterview = async () => {
    setIsLoading(true)
    
    try {
      const config = {
        mode,
        type,
        difficulty,
        role: role || "General Professional",
        company: company || "Target Company",
        industry: industry || "Technology",
        experience,
        questionCount,
        resumeText: resumeText || undefined,
        skills: skills ? skills.split(",").map(s => s.trim()).filter(Boolean) : undefined,
        focusAreas: focusAreas.length > 0 ? focusAreas : undefined
      }
      
      const response = await fetch("/api/interview/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      })
      
      if (!response.ok) throw new Error("Failed to generate questions")
      
      const { questions } = await response.json()
      
      setConfig(config)
      setQuestions(questions)
      setIsInterviewActive(true)
      setStartTime(Date.now())
      
      router.push("/interview/session")
    } catch (error) {
      console.error("[v0] Failed to start interview:", error)
      alert("Failed to start interview. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* IBM-style header */}
      <div className="mb-8 pb-6 border-b border-[#e0e0e0]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#0f62fe] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-[#161616]">IBM Interview Preparation</h1>
            <p className="text-sm text-[#525252]">AI-powered interview training platform</p>
          </div>
        </div>
      </div>

      {/* Progress indicator - IBM style */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#525252] uppercase tracking-wide">Progress</span>
          <span className="text-xs text-[#525252]">Step {step} of 4</span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 ${
                s <= step ? "bg-[#0f62fe]" : "bg-[#e0e0e0]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Interview Mode */}
      {step === 1 && (
        <div className="animate-in fade-in duration-300">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#161616] mb-1">
              Select Interview Format
            </h2>
            <p className="text-[#525252]">
              Choose how you would like to conduct your practice interview
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {modes.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMode(m.value)}
                className={`p-6 text-left border-2 transition-all ${
                  mode === m.value
                    ? "border-[#0f62fe] bg-[#edf5ff]"
                    : "border-[#e0e0e0] bg-white hover:border-[#8d8d8d]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 flex items-center justify-center ${
                    mode === m.value ? "bg-[#0f62fe]" : "bg-[#f4f4f4]"
                  }`}>
                    <m.icon className={`w-6 h-6 ${mode === m.value ? "text-white" : "text-[#525252]"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#161616] mb-1">
                      {m.label}
                    </h3>
                    <p className="text-sm text-[#525252] mb-3">{m.description}</p>
                    <ul className="space-y-1">
                      {m.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-[#525252]">
                          <CheckCircle2 className="w-3 h-3 text-[#198038]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => setStep(2)}
              className="bg-[#0f62fe] hover:bg-[#0353e9] text-white h-12 px-8"
            >
              Continue
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Professional Profile */}
      {step === 2 && (
        <div className="animate-in fade-in duration-300">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#161616] mb-1">
              Professional Profile
            </h2>
            <p className="text-[#525252]">
              Provide details about your target role and background
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Target Role */}
            <div>
              <Label className="text-sm font-medium text-[#161616] mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#0f62fe]" />
                Target Role *
              </Label>
              <Input
                placeholder="e.g., Senior Software Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-12 border-[#8d8d8d] focus:border-[#0f62fe] focus:ring-[#0f62fe]"
                list="roles"
              />
              <datalist id="roles">
                {popularRoles.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </div>

            {/* Target Company */}
            <div>
              <Label className="text-sm font-medium text-[#161616] mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0f62fe]" />
                Target Company
              </Label>
              <Input
                placeholder="e.g., IBM, Google, Microsoft"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="h-12 border-[#8d8d8d] focus:border-[#0f62fe] focus:ring-[#0f62fe]"
              />
            </div>

            {/* Industry */}
            <div>
              <Label className="text-sm font-medium text-[#161616] mb-2 block">
                Industry
              </Label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full h-12 px-3 border border-[#8d8d8d] bg-white text-[#161616] focus:border-[#0f62fe] focus:ring-1 focus:ring-[#0f62fe] outline-none"
              >
                <option value="">Select industry</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <Label className="text-sm font-medium text-[#161616] mb-2 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#0f62fe]" />
                Experience Level
              </Label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full h-12 px-3 border border-[#8d8d8d] bg-white text-[#161616] focus:border-[#0f62fe] focus:ring-1 focus:ring-[#0f62fe] outline-none"
              >
                {experienceLevels.map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>

            {/* Skills */}
            <div className="md:col-span-2">
              <Label className="text-sm font-medium text-[#161616] mb-2 block">
                Key Skills (comma-separated)
              </Label>
              <Input
                placeholder="e.g., Python, Machine Learning, Project Management, Leadership"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="h-12 border-[#8d8d8d] focus:border-[#0f62fe] focus:ring-[#0f62fe]"
              />
              <p className="text-xs text-[#525252] mt-1">
                Questions will be tailored to assess these skills
              </p>
            </div>

            {/* Resume Upload */}
            <div className="md:col-span-2">
              <Label className="text-sm font-medium text-[#161616] mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0f62fe]" />
                Resume / CV (Optional)
              </Label>
              
              {!resumeFileName ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#8d8d8d] p-6 text-center cursor-pointer hover:border-[#0f62fe] hover:bg-[#edf5ff] transition-colors"
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-[#525252]" />
                  <p className="text-sm text-[#161616] font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-[#525252] mt-1">
                    PDF, TXT, or DOC (Max 5MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="border border-[#e0e0e0] bg-[#f4f4f4] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0f62fe] flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#161616]">{resumeFileName}</p>
                      <p className="text-xs text-[#525252]">Resume uploaded successfully</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeResume}
                    className="p-2 hover:bg-[#e0e0e0] transition-colors"
                  >
                    <X className="w-5 h-5 text-[#525252]" />
                  </button>
                </div>
              )}
              <p className="text-xs text-[#525252] mt-2">
                Upload your resume for personalized questions based on your experience
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="h-12 px-6 border-[#8d8d8d] text-[#161616] hover:bg-[#e0e0e0]"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              className="bg-[#0f62fe] hover:bg-[#0353e9] text-white h-12 px-8"
            >
              Continue
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Interview Configuration */}
      {step === 3 && (
        <div className="animate-in fade-in duration-300">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#161616] mb-1">
              Interview Configuration
            </h2>
            <p className="text-[#525252]">
              Customize your interview type and difficulty
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {/* Interview Type */}
            <div>
              <Label className="text-sm font-medium text-[#161616] mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#0f62fe]" />
                Interview Type
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interviewTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={`p-4 text-left border transition-colors ${
                      type === t.value
                        ? "border-[#0f62fe] bg-[#edf5ff]"
                        : "border-[#e0e0e0] bg-white hover:border-[#8d8d8d]"
                    }`}
                  >
                    <span className={`text-sm font-medium block ${type === t.value ? "text-[#0f62fe]" : "text-[#161616]"}`}>
                      {t.label}
                    </span>
                    <span className="text-xs text-[#525252] block mt-1">
                      {t.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <Label className="text-sm font-medium text-[#161616] mb-3 block">
                Interview Level
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {difficultyLevels.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDifficulty(d.value)}
                    className={`p-4 text-center border transition-colors ${
                      difficulty === d.value
                        ? "border-[#0f62fe] bg-[#edf5ff]"
                        : "border-[#e0e0e0] bg-white hover:border-[#8d8d8d]"
                    }`}
                  >
                    <span className={`text-sm font-medium block ${difficulty === d.value ? "text-[#0f62fe]" : "text-[#161616]"}`}>
                      {d.label}
                    </span>
                    <span className="text-xs text-[#525252] block mt-1">
                      {d.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Focus Areas */}
            <div>
              <Label className="text-sm font-medium text-[#161616] mb-3 block">
                Focus Areas (Select up to 5)
              </Label>
              <div className="flex flex-wrap gap-2">
                {focusAreaOptions.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleFocusArea(area)}
                    className={`px-3 py-2 text-sm border transition-colors ${
                      focusAreas.includes(area)
                        ? "border-[#0f62fe] bg-[#0f62fe] text-white"
                        : "border-[#e0e0e0] bg-white text-[#161616] hover:border-[#8d8d8d]"
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#525252] mt-2">
                {focusAreas.length}/5 selected
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(2)}
              className="h-12 px-6 border-[#8d8d8d] text-[#161616] hover:bg-[#e0e0e0]"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={() => setStep(4)}
              className="bg-[#0f62fe] hover:bg-[#0353e9] text-white h-12 px-8"
            >
              Continue
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Start */}
      {step === 4 && (
        <div className="animate-in fade-in duration-300">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#161616] mb-1">
              Review & Start Interview
            </h2>
            <p className="text-[#525252]">
              Confirm your settings and begin your practice session
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {/* Question Count Slider */}
            <div className="bg-white border border-[#e0e0e0] p-6">
              <Label className="text-sm font-medium text-[#161616] mb-4 block">
                Number of Questions
              </Label>
              <div className="flex items-center gap-6">
                <input
                  type="range"
                  min={3}
                  max={10}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="flex-1 h-2 bg-[#e0e0e0] appearance-none cursor-pointer accent-[#0f62fe]"
                />
                <span className="text-2xl font-semibold text-[#0f62fe] w-12 text-center">
                  {questionCount}
                </span>
              </div>
              <div className="flex justify-between text-xs text-[#525252] mt-2">
                <span>Quick (3)</span>
                <span>Standard (5-7)</span>
                <span>Comprehensive (10)</span>
              </div>
            </div>

            {/* Summary Card - IBM style */}
            <div className="bg-[#161616] text-white p-6">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#525252]">
                <div className="w-10 h-10 bg-[#0f62fe] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Interview Summary</h3>
                  <p className="text-sm text-[#a8a8a8]">Review your configuration</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-[#a8a8a8]">Format</dt>
                      <dd className="font-medium capitalize">{mode} Interview</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[#a8a8a8]">Role</dt>
                      <dd className="font-medium">{role || "General Professional"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[#a8a8a8]">Company</dt>
                      <dd className="font-medium">{company || "Not specified"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[#a8a8a8]">Industry</dt>
                      <dd className="font-medium">{industry || "Not specified"}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-[#a8a8a8]">Experience</dt>
                      <dd className="font-medium">{experience}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[#a8a8a8]">Type</dt>
                      <dd className="font-medium capitalize">{type}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[#a8a8a8]">Level</dt>
                      <dd className="font-medium capitalize">{difficulty}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[#a8a8a8]">Questions</dt>
                      <dd className="font-medium">{questionCount}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              {(resumeFileName || focusAreas.length > 0 || skills) && (
                <div className="mt-4 pt-4 border-t border-[#525252]">
                  {resumeFileName && (
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <FileText className="w-4 h-4 text-[#0f62fe]" />
                      <span className="text-[#a8a8a8]">Resume:</span>
                      <span>{resumeFileName}</span>
                    </div>
                  )}
                  {focusAreas.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {focusAreas.map((area) => (
                        <span key={area} className="px-2 py-1 bg-[#393939] text-xs">
                          {area}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* IBM Info Box */}
            <div className="bg-[#edf5ff] border-l-4 border-l-[#0f62fe] p-4">
              <p className="text-sm text-[#161616]">
                <strong>Powered by IBM Watson AI.</strong> Your responses will be analyzed 
                using advanced natural language processing to provide detailed, actionable feedback.
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(3)}
              className="h-12 px-6 border-[#8d8d8d] text-[#161616] hover:bg-[#e0e0e0]"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={handleStartInterview}
              disabled={isLoading}
              className="bg-[#0f62fe] hover:bg-[#0353e9] text-white h-14 px-10 text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  Preparing Interview...
                </>
              ) : (
                <>
                  Start Interview
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
