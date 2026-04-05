"use client"

import { useEffect, useState, type ChangeEvent } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { analyzeSymptoms, type HealthAdvice } from "@/lib/synthetic-ai"

const translations = [
  { lang: "English", heading: "Health Check", placeholder: "Describe your symptoms..." },
  { lang: "हिन्दी", heading: "स्वास्थ्य जाँच", placeholder: "अपने लक्षणों का वर्णन करें..." },
  { lang: "ગુજરાતી", heading: "આરોગ્ય ચકાસણી", placeholder: "તમારા લક્ષણો વર્ણવો..." },
  { lang: "বাংলা", heading: "স্বাস্থ্য পরীক্ষা", placeholder: "আপনার উপসর্গ বর্ণনা করুন..." },
  { lang: "मराठी", heading: "आरोग्य तपासणी", placeholder: "तुमच्या लक्षणांचे वर्णन करा..." },
  { lang: "தமிழ்", heading: "ஆரோக்கிய சோதனை", placeholder: "உங்கள் அறிகுறிகளை விவரிக்கவும்..." },
]

export default function HealthCheck() {
  const [input, setInput] = useState<string>("")
  const [result, setResult] = useState<HealthAdvice | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [index, setIndex] = useState<number>(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((previousIndex: number) => (previousIndex + 1) % translations.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = () => {
    setLoading(true)
    setResult(analyzeSymptoms(input))
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_28%),linear-gradient(180deg,_#08111d_0%,_#020617_100%)]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-emerald-950/20 backdrop-blur-xl lg:grid-cols-[1fr_0.95fr]">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200">
              {translations[index].lang}
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">{translations[index].heading}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Type a symptom description and the offline agent will score the synthetic training set, infer a likely condition, and return a safe next-step summary.
              </p>
            </div>

            <textarea
              className="min-h-44 w-full rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-300/50"
              placeholder={translations[index].placeholder}
              value={input}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)}
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {loading ? "Analyzing..." : "Run offline triage"}
            </button>

            <div className="rounded-[1.5rem] border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
              This is a synthetic training demo, not a diagnosis tool. If symptoms are severe or worsening, seek in-person care.
            </div>
          </div>

          <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
            <h2 className="text-lg font-semibold text-white">Agent output</h2>
            {!result ? (
              <p className="text-sm leading-7 text-slate-300">
                Results will appear here after the synthetic model scores your symptoms.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Likely condition</div>
                    <div className="mt-2 text-base font-semibold text-white">{result.condition}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Urgency</div>
                    <div className="mt-2 text-base font-semibold text-white">{result.urgency}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Confidence</div>
                    <div className="mt-2 text-base font-semibold text-white">{Math.round(result.confidence * 100)}%</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm leading-7 text-slate-100">
                  {result.summary}
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Advice</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
                    {result.advice.map((item) => (
                      <li key={item} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Matched signals</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.matchedSignals.map((signal) => (
                      <span key={signal} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                        {signal}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Red flags</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{result.redFlags.join(", ")}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/find-doctor" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-emerald-300/40 hover:bg-white/10">
            Find doctors
          </Link>
          <Link href="/" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-emerald-300/40 hover:bg-white/10">
            Back home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
