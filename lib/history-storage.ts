import type { InterviewResult } from "./interview-types"

export interface HistoryEntry extends InterviewResult {
  id: string
  savedAt: string
}

const STORAGE_KEY = "interviewHistory_v1"
const MAX_SESSIONS = 50

function isClient(): boolean {
  return typeof window !== "undefined"
}

export function getHistory(): HistoryEntry[] {
  if (!isClient()) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as HistoryEntry[]
  } catch {
    return []
  }
}

export function saveSession(result: InterviewResult): HistoryEntry {
  const entry: HistoryEntry = {
    ...result,
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
  }
  if (isClient()) {
    const existing = getHistory()
    const updated = [entry, ...existing].slice(0, MAX_SESSIONS)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Storage quota exceeded or access denied — fail silently
    }
  }
  return entry
}

export function deleteSession(id: string): void {
  if (!isClient()) return
  const updated = getHistory().filter((e) => e.id !== id)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // fail silently
  }
}

export function clearHistory(): void {
  if (!isClient()) return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // fail silently
  }
}
