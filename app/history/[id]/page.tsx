"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ResultsView } from "@/components/interview/results-view"
import { getHistory, type HistoryEntry } from "@/lib/history-storage"
import { Loader2, ArrowLeft, ArrowRight, History } from "lucide-react"

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function HistorySessionPage() {
  const { id } = useParams<{ id: string }>()
  const [entry, setEntry] = useState<HistoryEntry | null | undefined>(undefined)
  // undefined = loading, null = not found, HistoryEntry = found

  useEffect(() => {
    const all = getHistory()
    const found = all.find((e) => e.id === id) ?? null
    setEntry(found)
  }, [id])

  // Loading
  if (entry === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0f62fe]" />
      </div>
    )
  }

  // Not found
  if (entry === null) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
        <Header />
        <main className="flex-1 pt-12 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-16 h-16 bg-[#e0e0e0] flex items-center justify-center mx-auto mb-6">
              <History className="w-8 h-8 text-[#525252]" />
            </div>
            <h1 className="text-2xl font-light text-[#161616] mb-2">Session not found</h1>
            <p className="text-[#525252] mb-8">
              This session may have been deleted or your browser history was cleared.
            </p>
            <Button
              asChild
              className="bg-[#0f62fe] hover:bg-[#0353e9] text-white h-10 px-6"
            >
              <Link href="/history">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to History
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      <Header />

      <main className="flex-1 pt-12">
        {/* Hero Section */}
        <div className="bg-[#161616] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex items-center gap-2 text-[#a8a8a8] text-sm mb-3">
              <Link href="/history" className="hover:text-white transition-colors">
                History
              </Link>
              <span>/</span>
              <span className="text-white">{entry.config.role || "Session"}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light mb-2">Interview Results</h1>
            <p className="text-[#c6c6c6]">
              {entry.config.role} · {formatDate(entry.savedAt)}
            </p>
          </div>
        </div>

        <ResultsView result={entry} />

        {/* Action Buttons */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pb-8">
            <Button
              asChild
              variant="outline"
              className="h-12 px-6 border-[#0f62fe] text-[#0f62fe] hover:bg-[#e8f1ff] bg-transparent"
            >
              <Link href="/history">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to History
              </Link>
            </Button>
            <Button
              asChild
              className="bg-[#0f62fe] hover:bg-[#0353e9] text-white h-12 px-6"
            >
              <Link href="/interview">
                Start New Interview
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
