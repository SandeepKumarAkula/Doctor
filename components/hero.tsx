"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { heroMessages } from "@/lib/offline-data"
import { quickStats } from "@/lib/site-content"

export default function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % heroMessages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
            Offline-first synthetic AI
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-7xl">
              {heroMessages[index].text}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              GramAarogya combines synthetic health agents, a local doctor registry, multilingual news briefs, and public-health insights into one self-contained rural care platform.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/health-check"
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Start triage
            </Link>
            <Link
              href="/find-doctor"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-emerald-300/40 hover:bg-white/10"
            >
              Browse doctors
            </Link>
            <Link
              href="/manage"
              className="inline-flex items-center justify-center rounded-full border border-sky-300/20 bg-sky-400/10 px-6 py-3 text-sm font-semibold text-sky-100 transition hover:border-sky-300/40 hover:bg-sky-400/15"
            >
              Open control center
            </Link>
          </div>
        </div>

        <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-emerald-950/30 backdrop-blur-xl sm:grid-cols-2">
          {quickStats.map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
              <div className="text-3xl font-semibold text-white">{stat.value}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.28em] text-slate-400">{stat.label}</div>
            </div>
          ))}
          <div className="sm:col-span-2 rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/15 to-cyan-400/10 p-5 text-slate-100">
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-200">Agent output</div>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              Everything on this page is derived from local synthetic data so the demo remains reproducible even without internet access.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

