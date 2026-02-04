"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useInterview } from "@/lib/interview-context"
import {
  Loader2,
  ArrowRight,
  RotateCcw,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Star,
  Target,
  TrendingUp,
  Award
} from "lucide-react"

export default function InterviewResultsPage() {
  const router = useRouter()
  const { result, resetInterview } = useInterview()
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0)

  useEffect(() => {
    if (!result) {
      router.push("/interview")
    }
  }, [result, router])

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0f62fe]" />
      </div>
    )
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const getRecommendationConfig = (rec: string) => {
    switch (rec) {
      case "strong-hire":
        return { label: "Strong Hire", color: "#198038", bg: "#defbe6", icon: CheckCircle2 }
      case "hire":
        return { label: "Hire", color: "#0f62fe", bg: "#e8f1ff", icon: CheckCircle2 }
      case "hold":
        return { label: "Hold", color: "#f1c21b", bg: "#fcf4d6", icon: AlertCircle }
      case "reject":
        return { label: "Not Recommended", color: "#da1e28", bg: "#fff1f1", icon: XCircle }
      default:
        return { label: "Pending", color: "#525252", bg: "#f4f4f4", icon: AlertCircle }
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "#198038"
    if (score >= 6) return "#0f62fe"
    if (score >= 4) return "#f1c21b"
    return "#da1e28"
  }

  const recConfig = getRecommendationConfig(result.recommendation)
  const RecIcon = recConfig.icon

  const handleStartNew = () => {
    resetInterview()
    router.push("/interview")
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      <Header />

      <main className="flex-1 pt-12">
        {/* Hero Section */}
        <div className="bg-[#161616] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-light mb-2">
              Interview Results
            </h1>
            <p className="text-[#c6c6c6]">
              Your AI-powered interview evaluation from IBM Watson
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          {/* Overview Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {/* Overall Score */}
            <div className="bg-white p-6 border-l-4" style={{ borderColor: getScoreColor(result.overallScore / 10) }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#525252] mb-1">Overall Score</p>
                  <p className="text-4xl font-light" style={{ color: getScoreColor(result.overallScore / 10) }}>
                    {result.overallScore}%
                  </p>
                </div>
                <Award className="w-8 h-8 text-[#8d8d8d]" />
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-white p-6 border-l-4" style={{ borderColor: recConfig.color }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#525252] mb-1">Recommendation</p>
                  <div className="flex items-center gap-2">
                    <RecIcon className="w-5 h-5" style={{ color: recConfig.color }} />
                    <p className="text-xl font-semibold" style={{ color: recConfig.color }}>
                      {recConfig.label}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions Answered */}
            <div className="bg-white p-6 border-l-4 border-l-[#0f62fe]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#525252] mb-1">Questions</p>
                  <p className="text-4xl font-light text-[#161616]">
                    {result.answers.length}
                  </p>
                </div>
                <MessageSquare className="w-8 h-8 text-[#8d8d8d]" />
              </div>
            </div>

            {/* Duration */}
            <div className="bg-white p-6 border-l-4 border-l-[#6929c4]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#525252] mb-1">Duration</p>
                  <p className="text-4xl font-light text-[#161616]">
                    {formatDuration(result.totalDuration)}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-[#8d8d8d]" />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Summary */}
            <div className="lg:col-span-1 space-y-6">
              {/* Interview Info */}
              <div className="bg-white p-6">
                <h2 className="text-lg font-semibold text-[#161616] mb-4">Interview Details</h2>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-[#525252]">Role</dt>
                    <dd className="text-[#161616] font-medium">{result.config.role}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#525252]">Type</dt>
                    <dd className="text-[#161616] font-medium capitalize">{result.config.type}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#525252]">Difficulty</dt>
                    <dd className="text-[#161616] font-medium capitalize">{result.config.difficulty}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#525252]">Mode</dt>
                    <dd className="text-[#161616] font-medium capitalize">{result.config.mode}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#525252]">Experience</dt>
                    <dd className="text-[#161616] font-medium">{result.config.experience}</dd>
                  </div>
                </dl>
              </div>

              {/* Strengths */}
              <div className="bg-white p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-[#198038]" />
                  <h2 className="text-lg font-semibold text-[#161616]">Key Strengths</h2>
                </div>
                <ul className="space-y-2">
                  {result.summary.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 bg-[#198038] rounded-full mt-1.5 flex-shrink-0" />
                      <span className="text-[#161616]">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div className="bg-white p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-[#0f62fe]" />
                  <h2 className="text-lg font-semibold text-[#161616]">Areas to Improve</h2>
                </div>
                <ul className="space-y-2">
                  {result.summary.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 bg-[#0f62fe] rounded-full mt-1.5 flex-shrink-0" />
                      <span className="text-[#161616]">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Overall Feedback */}
              <div className="bg-[#e8f1ff] p-6 border-l-4 border-l-[#0f62fe]">
                <h2 className="text-lg font-semibold text-[#161616] mb-2">AI Coach Feedback</h2>
                <p className="text-sm text-[#161616] leading-relaxed">
                  {result.summary.overallFeedback}
                </p>
              </div>
            </div>

            {/* Right Column - Detailed Feedback */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6">
                <h2 className="text-lg font-semibold text-[#161616] mb-6">Question-by-Question Feedback</h2>
                
                <div className="space-y-4">
                  {result.feedback.map((fb, index) => (
                    <div key={fb.questionId} className="border border-[#e0e0e0]">
                      <button
                        type="button"
                        onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                        className="w-full p-4 flex items-center justify-between hover:bg-[#f4f4f4] transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 bg-[#0f62fe] text-white flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <div className="text-left">
                            <p className="text-sm font-medium text-[#161616] line-clamp-1">
                              {fb.question}
                            </p>
                            <p className="text-xs text-[#525252]">
                              Overall: {fb.scores.overall}/10
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-2 bg-[#e0e0e0] overflow-hidden"
                          >
                            <div
                              className="h-full"
                              style={{
                                width: `${fb.scores.overall * 10}%`,
                                backgroundColor: getScoreColor(fb.scores.overall)
                              }}
                            />
                          </div>
                          {expandedQuestion === index ? (
                            <ChevronUp className="w-5 h-5 text-[#525252]" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-[#525252]" />
                          )}
                        </div>
                      </button>

                      {expandedQuestion === index && (
                        <div className="p-4 pt-0 border-t border-[#e0e0e0] bg-[#f4f4f4]">
                          {/* Your Answer */}
                          <div className="mb-4">
                            <h4 className="text-xs font-medium text-[#525252] mb-2 uppercase">Your Answer</h4>
                            <p className="text-sm text-[#161616] bg-white p-3 border border-[#e0e0e0]">
                              {fb.answer}
                            </p>
                          </div>

                          {/* Scores */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                            {Object.entries(fb.scores).map(([key, value]) => (
                              <div key={key} className="bg-white p-3">
                                <p className="text-xs text-[#525252] capitalize mb-1">{key}</p>
                                <p className="text-lg font-semibold" style={{ color: getScoreColor(value) }}>
                                  {value}/10
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* STAR Analysis */}
                          <div className="mb-4">
                            <h4 className="text-xs font-medium text-[#525252] mb-2 uppercase">STAR Method Analysis</h4>
                            <div className="grid grid-cols-4 gap-2">
                              {Object.entries(fb.starAnalysis).map(([key, value]) => (
                                <div key={key} className="bg-white p-2 text-center">
                                  <p className="text-xs text-[#525252] capitalize">{key}</p>
                                  <p className="text-sm font-semibold" style={{ color: getScoreColor(value) }}>
                                    {value}/10
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Strengths & Improvements */}
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-white p-3">
                              <h4 className="text-xs font-medium text-[#198038] mb-2 uppercase">Strengths</h4>
                              <ul className="space-y-1">
                                {fb.strengths.map((s, i) => (
                                  <li key={i} className="text-xs text-[#161616] flex items-start gap-1">
                                    <span className="text-[#198038]">+</span>
                                    {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-white p-3">
                              <h4 className="text-xs font-medium text-[#0f62fe] mb-2 uppercase">Improvements</h4>
                              <ul className="space-y-1">
                                {fb.improvements.map((imp, i) => (
                                  <li key={i} className="text-xs text-[#161616] flex items-start gap-1">
                                    <span className="text-[#0f62fe]">-</span>
                                    {imp}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Suggestion */}
                          <div className="bg-[#e8f1ff] p-3">
                            <h4 className="text-xs font-medium text-[#0f62fe] mb-1 uppercase">Suggestion</h4>
                            <p className="text-sm text-[#161616]">{fb.suggestions}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pb-8">
            <Button
              onClick={handleStartNew}
              variant="outline"
              className="h-12 px-6 border-[#0f62fe] text-[#0f62fe] hover:bg-[#e8f1ff] bg-transparent"
            >
              <RotateCcw className="mr-2 w-4 h-4" />
              Start New Interview
            </Button>
            <Button
              asChild
              className="bg-[#0f62fe] hover:bg-[#0353e9] text-white h-12 px-6"
            >
              <Link href="/">
                Back to Home
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
