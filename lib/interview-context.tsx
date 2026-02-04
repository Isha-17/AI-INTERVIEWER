"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { 
  InterviewConfig, 
  InterviewQuestion, 
  UserAnswer, 
  InterviewResult,
  QuestionFeedback
} from "./interview-types"

interface InterviewContextType {
  config: InterviewConfig | null
  setConfig: (config: InterviewConfig | null) => void
  questions: InterviewQuestion[]
  setQuestions: (questions: InterviewQuestion[]) => void
  answers: UserAnswer[]
  addAnswer: (answer: UserAnswer) => void
  currentQuestionIndex: number
  setCurrentQuestionIndex: (index: number) => void
  result: InterviewResult | null
  setResult: (result: InterviewResult | null) => void
  isInterviewActive: boolean
  setIsInterviewActive: (active: boolean) => void
  startTime: number | null
  setStartTime: (time: number | null) => void
  resetInterview: () => void
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined)

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<InterviewConfig | null>(null)
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [answers, setAnswers] = useState<UserAnswer[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [result, setResult] = useState<InterviewResult | null>(null)
  const [isInterviewActive, setIsInterviewActive] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)

  const addAnswer = (answer: UserAnswer) => {
    setAnswers(prev => [...prev, answer])
  }

  const resetInterview = () => {
    setConfig(null)
    setQuestions([])
    setAnswers([])
    setCurrentQuestionIndex(0)
    setResult(null)
    setIsInterviewActive(false)
    setStartTime(null)
  }

  return (
    <InterviewContext.Provider
      value={{
        config,
        setConfig,
        questions,
        setQuestions,
        answers,
        addAnswer,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        result,
        setResult,
        isInterviewActive,
        setIsInterviewActive,
        startTime,
        setStartTime,
        resetInterview
      }}
    >
      {children}
    </InterviewContext.Provider>
  )
}

export function useInterview() {
  const context = useContext(InterviewContext)
  if (context === undefined) {
    throw new Error("useInterview must be used within an InterviewProvider")
  }
  return context
}
