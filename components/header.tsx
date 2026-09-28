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
              width="48"
              height="20"
              viewBox="0 0 48 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M0 0H6.5V2H2V8H6.5V10H2V18H6.5V20H0V0ZM8.5 0H15V2H10.5V8H15V10H10.5V18H15V20H8.5V0Z"
                fill="currentColor"
              />
              <path
                d="M17 0H23.5C26.5 0 28.5 2 28.5 5V5.5C28.5 7.5 27.5 9 25.5 9.5C27.5 10 29 11.5 29 14V15C29 18 27 20 24 20H17V0ZM23 8C24.5 8 25.5 7 25.5 5.5V5C25.5 3.5 24.5 2 23 2H20V8H23ZM23.5 18C25 18 26 17 26 15V14.5C26 13 25 11 23 11H20V18H23.5Z"
                fill="currentColor"
              />
              <path
                d="M31 0H34.5L38.5 14.5L42.5 0H46L48 20H45L43.5 6L39.5 20H37.5L33.5 6L32 20H29L31 0Z"
                fill="currentColor"
              />
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
            href="/history"
            className="px-4 py-3 text-sm hover:bg-[#393939] transition-colors"
          >
            History
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
            href="/history"
            className="block px-4 py-3 text-sm hover:bg-[#393939] transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            History
          </Link>
        </nav>
      )}
    </header>
  )
}
