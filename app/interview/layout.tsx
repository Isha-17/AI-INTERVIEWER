import React from "react"
import { InterviewProvider } from "@/lib/interview-context"

export default function InterviewLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <InterviewProvider>{children}</InterviewProvider>
}
