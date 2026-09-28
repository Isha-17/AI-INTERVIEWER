"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useInterview } from "@/lib/interview-context"
import { ResultsView } from "@/components/interview/results-view"
import { Loader2, ArrowRight, RotateCcw } from "lucide-react"

export default function InterviewResultsPage() {
  const router = useRouter()
  const { result, resetInterview } = useInterview()

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

        <ResultsView result={result} />

        {/* Action Buttons */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
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
