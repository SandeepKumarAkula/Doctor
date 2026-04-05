import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { teamMembers } from "@/lib/offline-data"

export default function OurTeam() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.12),_transparent_28%),linear-gradient(180deg,_#07111f_0%,_#020617_100%)] text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-violet-950/20 backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-300">AarogyaParivar</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Our team</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            The team page now uses local profile data and keeps the project self-contained. The goal is to show the people and the product direction without relying on icon libraries or animated dependencies.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {teamMembers.map((member, index) => (
              <article key={member.name} className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl font-semibold text-violet-200">
                  {member.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-500">0{index + 1}</div>
                <h2 className="mt-2 text-lg font-semibold text-white">{member.name}</h2>
                <p className="mt-1 text-sm text-violet-200">{member.role}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{member.bio}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-500">Focus</p>
                <p className="mt-2 text-sm text-slate-200">{member.focus}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
