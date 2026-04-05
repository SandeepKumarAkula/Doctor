import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const storyPoints = [
  "Built to work offline-first with synthetic datasets bundled in the repository.",
  "Focuses on low-bandwidth rural healthcare journeys instead of cloud-only AI workflows.",
  "Uses a local scoring model for symptom triage, doctor ranking, news briefs, and health insights.",
]

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_28%),linear-gradient(180deg,_#07111f_0%,_#020617_100%)] text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-indigo-950/20 backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-indigo-300">About GramAarogya</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">A self-contained rural health platform</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            GramAarogya was refactored to remove external runtime dependencies and live API calls. The project now ships with synthetic health data, local matching logic, and offline-friendly UI routes.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {storyPoints.map((point, index) => (
              <article key={point} className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">0{index + 1}</div>
                <p className="mt-3 text-sm leading-6 text-slate-200">{point}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5">
            <h2 className="text-lg font-semibold text-white">What changed</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              <li>All search, triage, news, and insight flows now use bundled local data.</li>
              <li>The project can be opened without configuring third-party model keys or map services.</li>
              <li>Synthetic datasets provide deterministic, testable behavior for demos and prototyping.</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
