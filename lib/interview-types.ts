export type InterviewMode = "text" | "voice"

export type InterviewType = "technical" | "hr" | "behavioral" | "management" | "general" | "case-study"

export type DifficultyLevel = "entry" | "intermediate" | "senior" | "executive"

export interface InterviewConfig {
  mode: InterviewMode
  type: InterviewType
  difficulty: DifficultyLevel
  role: string
  company: string
  industry: string
  experience: string
  questionCount: number
  resumeText?: string
  skills?: string[]
  focusAreas?: string[]
}

export interface InterviewQuestion {
  id: number
  question: string
  category: string
}

export interface UserAnswer {
  questionId: number
  question: string
  answer: string
  timeSpent: number
}

export interface QuestionFeedback {
  questionId: number
  question: string
  answer: string
  scores: {
    relevance: number
    clarity: number
    structure: number
    confidence: number
    overall: number
  }
  starAnalysis: {
    situation: number
    task: number
    action: number
    result: number
  }
  strengths: string[]
  improvements: string[]
  suggestions: string
}

export interface InterviewResult {
  config: InterviewConfig
  answers: UserAnswer[]
  feedback: QuestionFeedback[]
  overallScore: number
  recommendation: "strong-hire" | "hire" | "hold" | "reject"
  summary: {
    strengths: string[]
    improvements: string[]
    overallFeedback: string
  }
  totalDuration: number
  completedAt: string
}

export const interviewTypes: { value: InterviewType; label: string; description: string }[] = [
  { value: "behavioral", label: "Behavioral", description: "STAR-based situational questions" },
  { value: "technical", label: "Technical", description: "Role-specific technical competencies" },
  { value: "hr", label: "HR / Culture Fit", description: "Values alignment & motivation" },
  { value: "case-study", label: "Case Study", description: "Problem-solving & analytical thinking" },
  { value: "management", label: "Leadership", description: "Team management & strategic thinking" },
  { value: "general", label: "Comprehensive", description: "Mixed assessment across all areas" }
]

export const difficultyLevels: { value: DifficultyLevel; label: string; description: string }[] = [
  { value: "entry", label: "Entry Level", description: "0-2 years experience" },
  { value: "intermediate", label: "Mid-Career", description: "3-5 years experience" },
  { value: "senior", label: "Senior", description: "6-10 years experience" },
  { value: "executive", label: "Executive", description: "Director & above" }
]

export const experienceLevels = [
  "Student / Recent Graduate",
  "Entry Level (0-2 years)",
  "Mid-Level (3-5 years)",
  "Senior (6-10 years)",
  "Lead / Principal (10+ years)",
  "Director / Executive"
]

export const industries = [
  "Technology & Software",
  "Financial Services",
  "Healthcare & Pharmaceuticals",
  "Consulting",
  "Manufacturing",
  "Retail & E-commerce",
  "Energy & Utilities",
  "Telecommunications",
  "Media & Entertainment",
  "Government & Public Sector",
  "Education",
  "Non-profit",
  "Other"
]

export const popularRoles = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "Business Analyst",
  "Project Manager",
  "UX/UI Designer",
  "DevOps Engineer",
  "Cloud Architect",
  "Marketing Manager",
  "Sales Executive",
  "Financial Analyst",
  "Operations Manager",
  "HR Business Partner",
  "Management Consultant",
  "Data Engineer",
  "Security Analyst",
  "Customer Success Manager",
  "Solutions Architect",
  "Technical Program Manager",
  "Research Scientist"
]

export const skillCategories = [
  "Technical Skills",
  "Leadership",
  "Communication",
  "Problem Solving",
  "Project Management",
  "Data Analysis",
  "Strategic Thinking",
  "Stakeholder Management",
  "Agile / Scrum",
  "Cloud Technologies",
  "Machine Learning / AI"
]

export const focusAreaOptions = [
  "Strengths & Weaknesses",
  "Career Goals",
  "Team Collaboration",
  "Conflict Resolution",
  "Decision Making",
  "Innovation & Creativity",
  "Customer Focus",
  "Results Orientation",
  "Adaptability",
  "Technical Expertise"
]
