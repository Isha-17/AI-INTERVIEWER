"use client"

import { useState, useEffect } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface TextInterviewProps {
  question: string
  questionNumber: number
  totalQuestions: number
  onSubmit: (answer: string, timeSpent: number) => void
  isSubmitting: boolean
}

export function TextInterview({
  question,
  questionNumber,
  totalQuestions,
  onSubmit,
  isSubmitting
}: TextInterviewProps) {
  const [answer, setAnswer] = useState("")
  const [startTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(timer)
  }, [startTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSubmit = () => {
    if (!answer.trim() || isSubmitting) return
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    onSubmit(answer, timeSpent)
    setAnswer("")
  }

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="h-full flex flex-col">
      {/* Question Display */}
      <div className="bg-white border-b border-[#e0e0e0] p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-[#525252]">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm font-mono text-[#0f62fe]">{formatTime(elapsedTime)}</span>
        </div>
        <p className="text-lg text-[#161616] leading-relaxed">{question}</p>
      </div>

      {/* Answer Input */}
      <div className="flex-1 p-6 bg-[#f4f4f4]">
        <div className="h-full flex flex-col">
          <Textarea
            placeholder="Type your answer here... Use the STAR method (Situation, Task, Action, Result) for behavioral questions."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="flex-1 min-h-[200px] resize-none border-[#8d8d8d] focus:border-[#0f62fe] focus:ring-[#0f62fe] text-base leading-relaxed"
            disabled={isSubmitting}
          />
          
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-[#525252]">
              {wordCount} words
            </span>
            <Button
              onClick={handleSubmit}
              disabled={!answer.trim() || isSubmitting}
              className="bg-[#0f62fe] hover:bg-[#0353e9] text-white h-12 px-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Answer
                  <Send className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
