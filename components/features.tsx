import { featureCards } from "@/lib/offline-data"

export default function Features() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-300">Why it works</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            A complete local health stack, built from synthetic data.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            The platform does not depend on external models or live APIs for its core user journeys. Each agent is represented with a bundled dataset and simple scoring logic so the demo stays portable.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {featureCards.map((feature, index) => (
            <article
              key={feature.title}
              className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/20 transition hover:-translate-y-1 hover:border-emerald-300/30 hover:bg-white/10"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200">
                  {feature.badge}
                </span>
                <span className="text-sm text-slate-400">0{index + 1}</span>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

