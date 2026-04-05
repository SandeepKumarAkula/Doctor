import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { getInsights } from "@/lib/synthetic-ai"

function chartWidth(percent: number) {
  return `${Math.max(8, percent)}%`
}

function linePoints(values: number[], width = 640, height = 220) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  return values
    .map((value, index) => {
      const x = (width / (values.length - 1)) * index
      const y = height - ((value - min) / span) * (height - 20) - 10
      return `${x},${y}`
    })
    .join(" ")
}

export default function HealthInsights() {
  const insights = getInsights()

  const lifeExpectancyUrban = insights.lifeExpectancy.map((point) => point.urban)
  const lifeExpectancyRural = insights.lifeExpectancy.map((point) => point.rural)
  const mortalityUrban = insights.mortality.map((point) => point.urban)
  const mortalityRural = insights.mortality.map((point) => point.rural)
  const careUrban = insights.careAccess.map((point) => point.urban)
  const careRural = insights.careAccess.map((point) => point.rural)

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.12),_transparent_28%),linear-gradient(180deg,_#07111f_0%,_#020617_100%)] text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-orange-950/20 backdrop-blur-xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-300">AarogyaView</p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Synthetic public health insights</h1>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Every chart below is rendered from bundled synthetic series, so the insights dashboard works without charting libraries or live datasets.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Urban life expectancy", "71.8 years"],
              ["Rural life expectancy", "67.4 years"],
              ["Urban care access", "93%"],
              ["Rural care access", "73%"],
            ].map(([label, value]) => (
              <article key={label} className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</div>
                <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <article className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5">
              <h2 className="text-lg font-semibold text-white">Life expectancy trend</h2>
              <svg viewBox="0 0 640 240" className="mt-4 h-60 w-full rounded-[1.25rem] bg-slate-900">
                <polyline fill="none" stroke="#4ade80" strokeWidth="4" points={linePoints(lifeExpectancyUrban)} />
                <polyline fill="none" stroke="#38bdf8" strokeWidth="4" points={linePoints(lifeExpectancyRural)} />
                {insights.lifeExpectancy.map((point, index) => (
                  <text key={point.year} x={index * (640 / (insights.lifeExpectancy.length - 1))} y="228" fill="#cbd5e1" fontSize="12">
                    {point.year}
                  </text>
                ))}
              </svg>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-400" /> Urban</span>
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-sky-400" /> Rural</span>
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5">
              <h2 className="text-lg font-semibold text-white">Child mortality trend</h2>
              <svg viewBox="0 0 640 240" className="mt-4 h-60 w-full rounded-[1.25rem] bg-slate-900">
                <polyline fill="none" stroke="#f97316" strokeWidth="4" points={linePoints(mortalityUrban)} />
                <polyline fill="none" stroke="#facc15" strokeWidth="4" points={linePoints(mortalityRural)} />
                {insights.mortality.map((point, index) => (
                  <text key={point.year} x={index * (640 / (insights.mortality.length - 1))} y="228" fill="#cbd5e1" fontSize="12">
                    {point.year}
                  </text>
                ))}
              </svg>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-orange-400" /> Urban</span>
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-400" /> Rural</span>
              </div>
            </article>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <article className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5">
              <h2 className="text-lg font-semibold text-white">Healthcare access</h2>
              <div className="mt-5 space-y-4">
                {insights.careAccess.map((point) => (
                  <div key={point.year} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>{point.year}</span>
                      <span>Urban {point.urban}% / Rural {point.rural}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-emerald-400" style={{ width: chartWidth(point.urban) }} />
                      <div className="h-full rounded-full bg-sky-400 opacity-70" style={{ width: chartWidth(point.rural), marginTop: "-12px" }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5">
              <h2 className="text-lg font-semibold text-white">Condition prevalence</h2>
              <div className="mt-5 space-y-4">
                {insights.healthConditions.map((condition) => (
                  <div key={condition.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>{condition.label}</span>
                      <span>Urban {condition.urban}% / Rural {condition.rural}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-3 rounded-full bg-emerald-400" style={{ width: chartWidth(condition.urban) }} />
                      <div className="h-3 rounded-full bg-sky-400" style={{ width: chartWidth(condition.rural) }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5">
            <h2 className="text-lg font-semibold text-white">Key takeaways</h2>
            <ul className="mt-4 grid gap-3 text-sm leading-7 text-slate-300 md:grid-cols-2">
              <li>Urban indicators remain stronger overall, especially access to care and life expectancy.</li>
              <li>Rural child mortality is still higher, which supports targeted maternal and paediatric interventions.</li>
              <li>Respiratory, gastrointestinal, and nutrition-related conditions have a larger rural share in the bundled series.</li>
              <li>The synthetic dashboard is designed for quick planning conversations and offline demonstrations.</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
