import Link from "next/link"
import { navLinks } from "@/lib/site-content"

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">GramAarogya</h2>
          <p className="max-w-md text-sm leading-6 text-slate-300">
            A self-contained rural healthcare platform with local AI agents, synthetic training data, and offline-friendly tools for triage, referral, and public health planning.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Navigate</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-200">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-emerald-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Built for</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>Low-bandwidth deployments</li>
            <li>Offline demonstrations</li>
            <li>Synthetic AI training pipelines</li>
            <li>Local-only content and data</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-6 text-center text-sm text-slate-400 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} GramAarogya. Synthetic data edition.
      </div>
    </footer>
  )
}

