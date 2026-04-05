"use client"

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { searchDoctors, type DoctorMatch } from "@/lib/synthetic-ai"

const appointmentTimes = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"]

function getDateOptions() {
  const options: string[] = []
  const today = new Date()

  for (let index = 1; index <= 14; index += 1) {
    const date = new Date(today)
    date.setDate(today.getDate() + index)
    options.push(date.toISOString().slice(0, 10))
  }

  return options
}

const dateOptions = getDateOptions()

export default function FindDoctor() {
  const [condition, setCondition] = useState("")
  const [location, setLocation] = useState("")
  const [results, setResults] = useState<DoctorMatch[]>([])
  const [loading, setLoading] = useState(false)
  const [bookingDrafts, setBookingDrafts] = useState<Record<string, { date: string; time: string }>>({})
  const [bookingMessages, setBookingMessages] = useState<Record<string, string>>({})

  const handleFindDoctors = () => {
    setLoading(true)
    setResults(searchDoctors(condition, location))
    setLoading(false)
  }

  const handleBookAppointment = (doctor: DoctorMatch) => {
    const draft = bookingDrafts[doctor.name] ?? { date: dateOptions[0], time: appointmentTimes[0] }
    setBookingMessages((current) => ({
      ...current,
      [doctor.name]: `Appointment booked with ${doctor.name} on ${draft.date} at ${draft.time}. A confirmation is stored locally in the demo.`,
    }))
  }

  const updateBookingDraft = (doctorName: string, field: "date" | "time", value: string) => {
    setBookingDrafts((current) => ({
      ...current,
      [doctorName]: {
        date: current[doctorName]?.date ?? dateOptions[0],
        time: current[doctorName]?.time ?? appointmentTimes[0],
        [field]: value,
      },
    }))
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_28%),linear-gradient(180deg,_#08111d_0%,_#020617_100%)] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-sky-950/20 backdrop-blur-xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">AarogyaConnect</p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Find nearby doctors from the local registry</h1>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Search synthetic doctor profiles by condition and city. The ranking score prefers matching specialties, language coverage, teleconsult availability, and proximity cues.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-300/50"
              placeholder="Enter a condition, e.g. fever, diabetes, skin rash"
              value={condition}
              onChange={(event) => setCondition(event.target.value)}
            />
            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-300/50"
              placeholder="Enter a city or region"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
            <button
              type="button"
              onClick={handleFindDoctors}
              disabled={loading || (!condition.trim() && !location.trim())}
              className="rounded-2xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {loading ? "Searching..." : "Find doctors"}
            </button>
          </div>

          {results.length > 0 ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {results.map((doctor) => (
                (() => {
                  const draft = bookingDrafts[doctor.name] ?? { date: dateOptions[0], time: appointmentTimes[0] }

                  return (
                <article key={doctor.name} className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white">{doctor.name}</h2>
                      <p className="mt-1 text-sm text-sky-200">{doctor.specialization}</p>
                    </div>
                    <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                      {doctor.rating.toFixed(1)}
                    </span>
                  </div>

                  <dl className="mt-4 space-y-3 text-sm text-slate-300">
                    <div className="flex justify-between gap-4">
                      <dt>Experience</dt>
                      <dd>{doctor.experience}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Fee</dt>
                      <dd>{doctor.fee}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Location</dt>
                      <dd className="text-right">{doctor.location}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Languages</dt>
                      <dd className="text-right">{doctor.languages.join(", ")}</dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {doctor.areas.map((area) => (
                      <span key={area} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                        {area}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm text-slate-300">
                    {doctor.reasons.map((reason) => (
                      <p key={reason}>• {reason}</p>
                    ))}
                    <p>Teleconsult: {doctor.teleconsult ? "Available" : "Not listed"}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <Link href={doctor.profileUrl} target="_blank" className="text-sm font-semibold text-sky-200 transition hover:text-sky-100">
                      View profile
                    </Link>
                    <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Score {doctor.score.toFixed(1)}</span>
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-semibold text-white">Book appointment</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <label className="space-y-2 text-sm text-slate-300">
                        <span className="block text-xs uppercase tracking-[0.24em] text-slate-500">Date</span>
                        <select
                          className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-300/50"
                          value={draft.date}
                          onChange={(event) => updateBookingDraft(doctor.name, "date", event.target.value)}
                        >
                          {dateOptions.map((date) => (
                            <option key={date} value={date}>
                              {date}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="space-y-2 text-sm text-slate-300">
                        <span className="block text-xs uppercase tracking-[0.24em] text-slate-500">Time</span>
                        <select
                          className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none focus:border-sky-300/50"
                          value={draft.time}
                          onChange={(event) => updateBookingDraft(doctor.name, "time", event.target.value)}
                        >
                          {appointmentTimes.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleBookAppointment(doctor)}
                      className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                    >
                      Book now
                    </button>
                    {bookingMessages[doctor.name] && (
                      <p className="mt-3 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm text-emerald-100">
                        {bookingMessages[doctor.name]}
                      </p>
                    )}
                  </div>
                </article>
                  )
                })()
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[1.5rem] border border-dashed border-white/10 bg-slate-950/50 p-8 text-center text-slate-300">
              Enter a condition and location to rank the built-in synthetic doctor registry.
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/health-check" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-sky-300/40 hover:bg-white/10">
              Open health check
            </Link>
            <Link href="/" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-sky-300/40 hover:bg-white/10">
              Back home
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
