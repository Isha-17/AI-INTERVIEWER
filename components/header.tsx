"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, User, HelpCircle, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#161616] text-white">
      <div className="flex items-center justify-between h-12 px-4 lg:px-8">
        {/* Logo & Brand */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <svg
              width="60"
              height="24"
              viewBox="0 0 60 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              {/* I */}
              <rect x="0" y="0" width="12" height="3" fill="currentColor"/>
              <rect x="3" y="3" width="6" height="3" fill="currentColor"/>
              <rect x="3" y="6" width="6" height="3" fill="currentColor"/>
              <rect x="0" y="9" width="12" height="3" fill="currentColor"/>
              <rect x="3" y="12" width="6" height="3" fill="currentColor"/>
              <rect x="3" y="15" width="6" height="3" fill="currentColor"/>
              <rect x="0" y="18" width="12" height="3" fill="currentColor"/>
              <rect x="0" y="21" width="12" height="3" fill="currentColor"/>
              {/* B */}
              <rect x="16" y="0" width="18" height="3" fill="currentColor"/>
              <rect x="16" y="3" width="18" height="3" fill="currentColor"/>
              <rect x="19" y="6" width="6" height="3" fill="currentColor"/>
              <rect x="28" y="6" width="6" height="3" fill="currentColor"/>
              <rect x="19" y="9" width="12" height="3" fill="currentColor"/>
              <rect x="19" y="12" width="12" height="3" fill="currentColor"/>
              <rect x="19" y="15" width="6" height="3" fill="currentColor"/>
              <rect x="28" y="15" width="6" height="3" fill="currentColor"/>
              <rect x="16" y="18" width="18" height="3" fill="currentColor"/>
              <rect x="16" y="21" width="18" height="3" fill="currentColor"/>
              {/* M */}
              <rect x="38" y="0" width="22" height="3" fill="currentColor"/>
              <rect x="38" y="3" width="22" height="3" fill="currentColor"/>
              <rect x="38" y="6" width="6" height="3" fill="currentColor"/>
              <rect x="46" y="6" width="6" height="3" fill="currentColor"/>
              <rect x="54" y="6" width="6" height="3" fill="currentColor"/>
              <rect x="38" y="9" width="6" height="3" fill="currentColor"/>
              <rect x="46" y="9" width="6" height="3" fill="currentColor"/>
              <rect x="54" y="9" width="6" height="3" fill="currentColor"/>
              <rect x="38" y="12" width="6" height="3" fill="currentColor"/>
              <rect x="54" y="12" width="6" height="3" fill="currentColor"/>
              <rect x="38" y="15" width="6" height="3" fill="currentColor"/>
              <rect x="54" y="15" width="6" height="3" fill="currentColor"/>
              <rect x="38" y="18" width="6" height="3" fill="currentColor"/>
              <rect x="54" y="18" width="6" height="3" fill="currentColor"/>
              <rect x="38" y="21" width="6" height="3" fill="currentColor"/>
              <rect x="54" y="21" width="6" height="3" fill="currentColor"/>
            </svg>
            <span className="text-sm font-medium hidden sm:inline">Watson Interview AI</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className="px-4 py-3 text-sm hover:bg-[#393939] transition-colors"
          >
            Home
          </Link>
          <Link
            href="/interview"
            className="px-4 py-3 text-sm hover:bg-[#393939] transition-colors"
          >
            Interview
          </Link>
          <Link
            href="/results"
            className="px-4 py-3 text-sm hover:bg-[#393939] transition-colors"
          >
            Results
          </Link>
        </nav>

        {/* Right side icons */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-[#393939] transition-colors hidden sm:flex" aria-label="Notifications">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-[#393939] transition-colors hidden sm:flex" aria-label="Help">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-[#393939] transition-colors" aria-label="User menu">
            <User className="w-5 h-5" />
          </button>
          <button
            className="p-2 hover:bg-[#393939] transition-colors md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-[#262626] border-t border-[#393939]">
          <Link
            href="/"
            className="block px-4 py-3 text-sm hover:bg-[#393939] transition-colors border-b border-[#393939]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/interview"
            className="block px-4 py-3 text-sm hover:bg-[#393939] transition-colors border-b border-[#393939]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Interview
          </Link>
          <Link
            href="/results"
            className="block px-4 py-3 text-sm hover:bg-[#393939] transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Results
          </Link>
        </nav>
      )}
    </header>
  )
}
