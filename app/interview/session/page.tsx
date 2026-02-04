"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { useInterview } from "@/lib/interview-context"
import { TextInterview } from "@/components/interview/text-interview"
import { VoiceInterview } from "@/components/interview/voice-interview"
import { Loader2, Clock, MessageSquare, Mic, Briefcase, Building2 } from "lucide-react"
import type { UserAnswer, InterviewResult } from "@/lib/interview-types"

export default function InterviewSessionPage() {
  const router = useRouter()
  const {
    config,
    questions,
    answers,
    addAnswer,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    setResult,
    isInterviewActive,
    startTime
  } = useInterview()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    if (!config || !isInterviewActive || questions.length === 0) {
      router.push("/interview")
      return
    }

    const timer = setInterval(() => {
      if (startTime) {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [config, isInterviewActive, questions, router, startTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSubmit = async (answer: string, timeSpent: number) => {
    if (!config) return
    
    const currentQuestion = questions[currentQuestionIndex]
    
    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      answer,
      timeSpent
    }
    
    addAnswer(userAnswer)
    setIsSubmitting(true)

    if (currentQuestionIndex >= questions.length - 1) {
      try {
        const allAnswers = [...answers, userAnswer]
        
        const response = await fetch("/api/interview/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            config,
            answers: allAnswers
          })
        })
        
        if (!response.ok) throw new Error("Failed to evaluate interview")
        
        const result: InterviewResult = await response.json()
        setResult(result)
        
        router.push("/interview/results")
      } catch (error) {
        console.error("[v0] Failed to evaluate interview:", error)
        alert("Failed to evaluate your interview. Please try again.")
        setIsSubmitting(false)
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setIsSubmitting(false)
    }
  }

  if (!config || !isInterviewActive || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0f62fe]" />
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const ModeIcon = config.mode === "text" ? MessageSquare : Mic

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      <Header />
      
      <main className="flex-1 pt-12 flex flex-col">
        {/* Professional Header Bar */}
        <div className="bg-[#161616] text-white">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#0f62fe] flex items-center justify-center">
                    <ModeIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium capitalize">
                    {config.mode} Interview
                  </span>
                </div>
                <div className="hidden md:flex items-center gap-4 text-sm text-[#a8a8a8]">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {config.role}
                  </span>
                  {config.company && (
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {config.company}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-[#a8a8a8] capitalize">{config.type}</span>
                <div className="flex items-center gap-2 bg-[#393939] px-3 py-1">
                  <Clock className="w-4 h-4 text-[#0f62fe]" />
                  <span className="text-sm font-mono">{formatTime(elapsedTime)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white border-b border-[#e0e0e0]">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#161616]">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm text-[#525252]">
                {Math.round(((currentQuestionIndex) / questions.length) * 100)}% Complete
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-1.5 transition-colors ${
                    index < currentQuestionIndex
                      ? "bg-[#198038]"
                      : index === currentQuestionIndex
                      ? "bg-[#0f62fe]"
                      : "bg-[#e0e0e0]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Interview Interface */}
        <div className="flex-1 flex flex-col">
          {config.mode === "text" && (
            <TextInterview
              question={currentQuestion.question}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onSubmit={handleAnswerSubmit}
              isSubmitting={isSubmitting}
            />
          )}
          
          {config.mode === "voice" && (
            <VoiceInterview
              question={currentQuestion.question}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onSubmit={handleAnswerSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </main>

      {/* IBM Footer */}
      <div className="bg-[#161616] py-3 text-center">
        <p className="text-xs text-[#a8a8a8]">
          Powered by IBM Watson AI | IBM SkillsBuild
        </p>
      </div>
    </div>
  )
}
