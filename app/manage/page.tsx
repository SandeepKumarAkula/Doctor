"use client"

import { useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { doctorProfiles, healthCenters, teamMembers } from "@/lib/offline-data"
import { buildNewsBrief, getInsights, searchDoctors } from "@/lib/synthetic-ai"

type Role = "patients" | "doctors" | "hospitals" | "admins"

const roles: { id: Role; label: string; description: string }[] = [
  { id: "patients", label: "Patients", description: "Book care, triage symptoms, and track next steps." },
  { id: "doctors", label: "Doctors", description: "Review demand, consultations, and follow-ups." },
  { id: "hospitals", label: "Hospitals", description: "Coordinate referrals, services, and outreach." },
  { id: "admins", label: "Admins", description: "Monitor the offline platform and publish updates." },
]

const serviceGroups = [
  "primary care",
  "emergency",
  "teleconsult",
  "immunization",
  "maternal health",
  "diagnostics",
  "diabetes care",
]

function formatPercent(value: number) {
  return `${Math.round(value)}%`
}

export default function ManagePage() {
  const [selectedRole, setSelectedRole] = useState<Role>("patients")
  const [patientCondition, setPatientCondition] = useState("fever and cough")
  const [patientLocation, setPatientLocation] = useState("Pune")
  const [hospitalFilter, setHospitalFilter] = useState("all")
  const [statusMessage, setStatusMessage] = useState("All management views are connected to the offline registry.")

  const patientMatches = useMemo(() => searchDoctors(patientCondition, patientLocation).slice(0, 3), [patientCondition, patientLocation])
  const insights = useMemo(() => getInsights(), [])
  const englishBrief = useMemo(() => buildNewsBrief("English"), [])

  const nearbyCenters = useMemo(
    () => healthCenters.filter((center) => hospitalFilter === "all" || center.type === hospitalFilter),
    [hospitalFilter],
  )

  const roleContent: Record<Role, ReactNode> = {
    patients: (
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[1.75rem] border border-emerald-300/20 bg-emerald-400/10 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200">Patient workflow</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Find care, book a slot, and keep the plan local.</h2>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            This portal keeps the patient path simple: enter symptoms, choose a location, get ranked doctors, and reserve a date and time without leaving the app.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300">
              <span className="block text-xs uppercase tracking-[0.24em] text-slate-400">Condition</span>
              <input
                value={patientCondition}
                onChange={(event) => setPatientCondition(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-emerald-300/50"
                placeholder="fever, diabetes, rash"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              <span className="block text-xs uppercase tracking-[0.24em] text-slate-400">Location</span>
              <input
                value={patientLocation}
                onChange={(event) => setPatientLocation(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-emerald-300/50"
                placeholder="city or region"
              />
            </label>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {patientMatches.map((doctor) => (
              <article key={doctor.name} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-white">{doctor.name}</h3>
                    <p className="mt-1 text-sm text-emerald-200">{doctor.specialization}</p>
                  </div>
                  <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-xs font-semibold text-emerald-100">
                    {doctor.score.toFixed(1)}
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-300">{doctor.location}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">{doctor.languages.join(" • ")}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200">Patient status</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {patientMatches[0]
                ? `Top recommendation is ${patientMatches[0].name} for ${patientCondition.trim() || "your symptoms"} in ${patientLocation.trim() || "your area"}.`
                : "Enter a condition and location to populate patient recommendations."}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200">Ready actions</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>• Symptom triage from local synthetic training data</li>
              <li>• Doctor booking with date and time selection</li>
              <li>• Health-center lookup with offline facility coordinates</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
    doctors: (
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <section className="rounded-[1.75rem] border border-sky-300/20 bg-sky-400/10 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200">Doctor operations</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Review demand, language coverage, and teleconsult readiness.</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {doctorProfiles.map((doctor, index) => (
              <article key={doctor.name} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-white">{doctor.name}</h3>
                  <span className="text-xs uppercase tracking-[0.24em] text-slate-500">#{index + 1}</span>
                </div>
                <p className="mt-2 text-sm text-sky-200">{doctor.specialization}</p>
                <p className="mt-3 text-sm text-slate-300">{doctor.location}</p>
                <p className="mt-2 text-xs text-slate-400">Teleconsult: {doctor.teleconsult ? "Enabled" : "Not listed"}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200">Demand snapshot</p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              {patientMatches.map((doctor) => (
                <div key={doctor.name} className="flex items-center justify-between gap-3">
                  <span>{doctor.name}</span>
                  <span className="text-sky-200">{doctor.score.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200">Team support</p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              {teamMembers.map((member) => (
                <div key={member.name}>
                  <p className="font-medium text-white">{member.name}</p>
                  <p>{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    ),
    hospitals: (
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="space-y-4 rounded-[1.75rem] border border-amber-300/20 bg-amber-400/10 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">Hospital control</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Coordinate referrals, services, and outreach across centers.</h2>

          <label className="mt-6 block space-y-2 text-sm text-slate-300">
            <span className="block text-xs uppercase tracking-[0.24em] text-slate-400">Filter by service type</span>
            <select
              value={hospitalFilter}
              onChange={(event) => setHospitalFilter(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-amber-300/50"
            >
              <option value="all">All centers</option>
              {Array.from(new Set(healthCenters.map((center) => center.type))).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {serviceGroups.map((service) => (
              <div key={service} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-200">
                {service}
              </div>
            ))}
          </div>
        </aside>

        <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="grid gap-4 md:grid-cols-2">
            {nearbyCenters.map((center) => (
              <article key={center.name} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-white">{center.name}</h3>
                    <p className="mt-1 text-sm text-amber-200">{center.address}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                    {center.type}
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-300">Services: {center.services.join(", ")}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    ),
    admins: (
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <section className="rounded-[1.75rem] border border-violet-300/20 bg-violet-400/10 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-200">Platform admin</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Monitor the offline deployment and publish shared updates.</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Doctors", value: doctorProfiles.length.toString() },
              { label: "Centers", value: healthCenters.length.toString() },
              { label: "Languages", value: "6" },
              { label: "Training cases", value: "5" },
            ].map((metric) => (
              <div key={metric.label} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                <div className="text-2xl font-semibold text-white">{metric.value}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-400">{metric.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-200">Content brief</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{englishBrief.summary}</p>
          </div>
        </section>

        <aside className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-200">System health</p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between"><span>Offline data</span><span className="text-emerald-200">Ready</span></div>
              <div className="flex items-center justify-between"><span>Geolocation fallback</span><span className="text-emerald-200">Available</span></div>
              <div className="flex items-center justify-between"><span>Appointment booking</span><span className="text-emerald-200">Enabled</span></div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-200">Insights preview</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-300">
              <p>Life expectancy trend points: {insights.lifeExpectancy.length}</p>
              <p>Condition categories tracked: {insights.healthConditions.length}</p>
              <p>Mortality trend points: {insights.mortality.length}</p>
            </div>
          </div>
        </aside>
      </div>
    ),
  }

  const triggerAction = (label: string) => {
    setStatusMessage(`${label} saved locally in the offline control center.`)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.16),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.12),_transparent_24%),linear-gradient(180deg,_#07111f_0%,_#020617_100%)] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-sky-950/20 backdrop-blur-xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">Unified Control Center</p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">One place for patients, doctors, hospitals, and admins</h1>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              GramAarogya is now arranged as a full offline portal: patients can search and book, doctors can review demand, hospitals can coordinate services, and admins can manage the platform without external dependencies.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              { label: "Doctors onboarded", value: doctorProfiles.length.toString() },
              { label: "Health centers", value: healthCenters.length.toString() },
              { label: "Team members", value: teamMembers.length.toString() },
              { label: "Offline ready", value: "Yes" },
            ].map((metric) => (
              <div key={metric.label} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                <div className="text-3xl font-semibold text-white">{metric.value}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.28em] text-slate-400">{metric.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  setSelectedRole(role.id)
                  setStatusMessage(`${role.label} view opened.`)
                }}
                className={`rounded-full border px-5 py-3 text-sm font-medium transition ${
                  selectedRole === role.id
                    ? "border-emerald-300/40 bg-emerald-300/15 text-emerald-100"
                    : "border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10"
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Current workspace</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{roles.find((role) => role.id === selectedRole)?.label}</h2>
                <p className="mt-1 text-sm text-slate-300">{roles.find((role) => role.id === selectedRole)?.description}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                {statusMessage}
              </div>
            </div>

            <div className="mt-6">{roleContent[selectedRole]}</div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => triggerAction("Roster sync")}
                className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Sync roster
              </button>
              <button
                type="button"
                onClick={() => triggerAction("Referrals reviewed")}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
              >
                Review referrals
              </button>
              <Link
                href="/find-doctor"
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
              >
                Open bookings
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}