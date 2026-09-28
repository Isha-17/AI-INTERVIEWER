"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  getHistory,
  deleteSession,
  clearHistory,
  type HistoryEntry,
} from "@/lib/history-storage"
import {
  Loader2,
  Trash2,
  History,
  ArrowRight,
  Award,
  Clock,
  Briefcase,
  Building2,
} from "lucide-react"
import { cn } from "@/lib/utils"

function getScoreColor(score: number): string {
  if (score >= 80) return "#198038"
  if (score >= 60) return "#0f62fe"
  if (score >= 40) return "#f1c21b"
  return "#da1e28"
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function HistoryPage() {
  const router = useRouter()
  const [entries, setEntries] = useState<HistoryEntry[] | null>(null)

  useEffect(() => {
    setEntries(getHistory())
  }, [])

  function handleDelete(id: string) {
    deleteSession(id)
    setEntries((prev) => (prev ? prev.filter((e) => e.id !== id) : []))
  }

  function handleClearAll() {
    if (!window.confirm("Delete all interview history? This cannot be undone.")) return
    clearHistory()
    setEntries([])
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      <Header />

      <main className="flex-1 pt-12">
        {/* Hero band */}
        <div className="bg-[#161616] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-light mb-2">Interview History</h1>
              <p className="text-[#c6c6c6]">Your saved practice sessions</p>
            </div>
            {entries && entries.length > 0 && (
              <Button
                onClick={handleClearAll}
                variant="outline"
                className="border-[#da1e28] text-[#da1e28] hover:bg-[#da1e28] hover:text-white bg-transparent h-10 px-4 text-sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          {/* Loading */}
          {entries === null && (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-[#0f62fe]" />
            </div>
          )}

          {/* Empty state */}
          {entries !== null && entries.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-[#e0e0e0] flex items-center justify-center mb-6">
                <History className="w-8 h-8 text-[#525252]" />
              </div>
              <h2 className="text-xl font-light text-[#161616] mb-2">No sessions yet</h2>
              <p className="text-[#525252] mb-8">
                Complete an interview to see your results here.
              </p>
              <Button
                asChild
                className="bg-[#0f62fe] hover:bg-[#0353e9] text-white h-10 px-6"
              >
                <Link href="/interview">
                  Start an Interview
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          )}

          {/* Session list */}
          {entries !== null && entries.length > 0 && (
            <div className="space-y-0 border border-[#e0e0e0]">
              {/* Table header */}
              <div className="hidden md:grid grid-cols-[1fr_1fr_120px_100px_100px_80px] gap-4 bg-[#e0e0e0] px-4 py-2">
                <span className="text-xs font-medium text-[#525252] uppercase">Role</span>
                <span className="text-xs font-medium text-[#525252] uppercase">Company</span>
                <span className="text-xs font-medium text-[#525252] uppercase">Type</span>
                <span className="text-xs font-medium text-[#525252] uppercase">Date</span>
                <span className="text-xs font-medium text-[#525252] uppercase">Score</span>
                <span className="text-xs font-medium text-[#525252] uppercase sr-only">Actions</span>
              </div>

              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className={cn(
                    "group bg-white border-b border-[#e0e0e0] last:border-b-0",
                    "hover:bg-[#f4f4f4] transition-colors"
                  )}
                >
                  {/* Desktop row */}
                  <div className="hidden md:grid grid-cols-[1fr_1fr_120px_100px_100px_80px] gap-4 items-center px-4 py-4">
                    <button
                      type="button"
                      onClick={() => router.push(`/history/${entry.id}`)}
                      className="text-left text-sm font-medium text-[#161616] hover:text-[#0f62fe] truncate"
                    >
                      <span className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-[#525252] flex-shrink-0" />
                        {entry.config.role || "—"}
                      </span>
                    </button>
                    <span className="text-sm text-[#525252] truncate flex items-center gap-2">
                      {entry.config.company ? (
                        <>
                          <Building2 className="w-4 h-4 flex-shrink-0" />
                          {entry.config.company}
                        </>
                      ) : (
                        "—"
                      )}
                    </span>
                    <span className="text-sm text-[#525252] capitalize">{entry.config.type}</span>
                    <span className="text-sm text-[#525252] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                      {formatDate(entry.savedAt)}
                    </span>
                    <span
                      className="text-sm font-semibold flex items-center gap-1"
                      style={{ color: getScoreColor(entry.overallScore) }}
                    >
                      <Award className="w-4 h-4 flex-shrink-0" />
                      {entry.overallScore}%
                    </span>
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => router.push(`/history/${entry.id}`)}
                        className="text-xs text-[#0f62fe] hover:underline px-2 py-1"
                        aria-label="View session"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(entry.id)}
                        className="p-1 text-[#525252] hover:text-[#da1e28] transition-colors"
                        aria-label="Delete session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Mobile row */}
                  <div className="md:hidden px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => router.push(`/history/${entry.id}`)}
                        className="text-left flex-1 min-w-0"
                      >
                        <p className="text-sm font-medium text-[#161616] truncate">
                          {entry.config.role || "Untitled Session"}
                        </p>
                        {entry.config.company && (
                          <p className="text-xs text-[#525252] truncate mt-0.5">
                            {entry.config.company}
                          </p>
                        )}
                        <p className="text-xs text-[#525252] mt-1 capitalize">
                          {entry.config.type} · {formatDate(entry.savedAt)}
                        </p>
                      </button>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className="text-sm font-semibold"
                          style={{ color: getScoreColor(entry.overallScore) }}
                        >
                          {entry.overallScore}%
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDelete(entry.id)}
                          className="p-1 text-[#525252] hover:text-[#da1e28] transition-colors"
                          aria-label="Delete session"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {entries !== null && entries.length > 0 && (
            <p className="text-xs text-[#525252] mt-4 text-right">
              {entries.length} session{entries.length !== 1 ? "s" : ""} saved
              {entries.length === 50 ? " (maximum reached — oldest sessions are removed automatically)" : ""}
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
