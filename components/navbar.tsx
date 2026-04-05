"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { navLinks } from "@/lib/site-content"

const brandNames = ["GramAarogya", "ग्रामआरोग्य", "ગ્રામઆરોગ્ય", "গ্রામআরোগ্য", "ग्रामआरोग्य", "கிராமாரோக்கிய"]
const greetings = ["Hello", "नमस्ते", "નમસ્તે", "নমস্কার", "नमस्कार", "வணக்கம்"]

export default function Navbar() {
  const [indexLeft, setIndexLeft] = useState(0)
  const [indexRight, setIndexRight] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const intervalLeft = setInterval(() => {
      setIndexLeft((prevIndex) => (prevIndex + 1) % brandNames.length)
    }, 3000)

    const intervalRight = setInterval(() => {
      setIndexRight((prevIndex) => (prevIndex + 1) % greetings.length)
    }, 3000)

    return () => {
      clearInterval(intervalLeft)
      clearInterval(intervalRight)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-sm font-semibold text-emerald-200">
            GA
          </span>
          <span className="text-lg font-semibold tracking-wide text-white sm:text-xl">{brandNames[indexLeft]}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-emerald-300">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-slate-300 sm:inline">{greetings[indexRight]}</span>
          <button
            type="button"
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-emerald-300/40 hover:bg-white/10 md:hidden"
            onClick={() => setDropdownOpen((value) => !value)}
            aria-expanded={dropdownOpen}
            aria-controls="mobile-menu"
          >
            Menu {dropdownOpen ? "▴" : "▾"}
          </button>
        </div>
      </div>

      {dropdownOpen && (
        <div id="mobile-menu" className="border-t border-white/10 bg-slate-950 px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 transition hover:border-emerald-300/40 hover:bg-white/10"
                onClick={() => setDropdownOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

