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
            <span className="text-xl font-bold tracking-tight">IBM</span>
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
