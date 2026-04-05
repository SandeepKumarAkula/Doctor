"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { buildNewsBrief, getNewsByLanguage } from "@/lib/synthetic-ai"
import { formatDate } from "@/lib/format"

const languages = ["English", "Hindi", "Gujarati", "Marathi", "Bengali", "Tamil"]

export default function NewsHelp() {
  const [language, setLanguage] = useState("English")

  const news = useMemo(() => buildNewsBrief(language), [language])
  const articles = getNewsByLanguage(language)

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),_transparent_28%),linear-gradient(180deg,_#07111f_0%,_#020617_100%)] text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-emerald-950/20 backdrop-blur-xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-300">AarogyaPulse</p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Offline health news briefings</h1>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Health updates are stored in the repository and filtered locally, so the news experience works without any external feed or API.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">
            <select
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-emerald-300/50"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              {languages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-5 py-3 text-sm text-emerald-100">
              {news.summary}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <article key={article.title} className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-white">{article.title}</h2>
                    <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">{article.source}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                    {article.language}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-300">{article.description}</p>
                <p className="mt-3 text-sm leading-7 text-slate-200">{article.content}</p>

                <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-sm text-slate-400">
                  <span>{formatDate(article.date)}</span>
                  <Link href={article.url} target="_blank" className="font-semibold text-emerald-200 transition hover:text-emerald-100">
                    Read more
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/health-insights" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-emerald-300/40 hover:bg-white/10">
              View insights
            </Link>
            <Link href="/" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-emerald-300/40 hover:bg-white/10">
              Back home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
