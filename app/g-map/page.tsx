"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"
import { findNearbyHealthCenters, type NearbyCenter } from "../../lib/synthetic-ai"

const defaultLocation = { lat: 19.076, lng: 72.8777, label: "Mumbai" }

function distanceLabel(distanceKm: number) {
  return `${distanceKm.toFixed(1)} km away`
}

export default function GMap() {
  const [location, setLocation] = useState(defaultLocation)
  const [facilityType, setFacilityType] = useState("all")
  const [geoError, setGeoError] = useState<string | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  const requestLocation = () => {
    setIsLocating(true)

    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported in this browser. Showing the default regional view.")
      setIsLocating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: "Your location",
        })
        setGeoError(null)
        setIsLocating(false)
      },
      () => {
        setGeoError("Location access was denied. Showing the default regional view.")
        setIsLocating(false)
      },
      { enableHighAccuracy: true },
    )
  }

  useEffect(() => {
    requestLocation()
  }, [])

  const centers: NearbyCenter[] = useMemo(() => {
    return findNearbyHealthCenters(location.lat, location.lng, facilityType)
  }, [facilityType, location.lat, location.lng])

  const svgPoints = centers.slice(0, 6).map((center) => center)

  const allLatitudes = [location.lat, ...svgPoints.map((point) => point.latitude)]
  const allLongitudes = [location.lng, ...svgPoints.map((point) => point.longitude)]
  const minLatitude = Math.min(...allLatitudes)
  const maxLatitude = Math.max(...allLatitudes)
  const minLongitude = Math.min(...allLongitudes)
  const maxLongitude = Math.max(...allLongitudes)
  const latitudeSpan = maxLatitude - minLatitude || 1
  const longitudeSpan = maxLongitude - minLongitude || 1

  const projectPoint = (latitude: number, longitude: number) => {
    const x = 80 + ((longitude - minLongitude) / longitudeSpan) * 560
    const y = 460 - ((latitude - minLatitude) / latitudeSpan) * 360
    return {
      x: Math.max(80, Math.min(640, x)),
      y: Math.max(60, Math.min(460, y)),
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_28%),linear-gradient(180deg,_#08111d_0%,_#020617_100%)] text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-sky-950/20 backdrop-blur-xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">AarogyaMap</p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Local healthcare map without external map tiles</h1>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              The map view uses the built-in health-center registry and the browser location only when available. No Google Maps or other external map service is required.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
            <select
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-sky-300/50"
              value={facilityType}
              onChange={(event) => setFacilityType(event.target.value)}
            >
              <option value="all">All medical facilities</option>
              <option value="public">Public health centers</option>
              <option value="private">Private health centers</option>
              <option value="clinic">Clinics</option>
              <option value="medical">Medical hubs</option>
            </select>
            <button
              type="button"
              onClick={requestLocation}
              disabled={isLocating}
              className="rounded-2xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {isLocating ? "Locating..." : "Use my location"}
            </button>
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-5 py-3 text-sm text-slate-300">
              Showing results from {location.label} at {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
            </div>
          </div>

          {geoError && <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">{geoError}</div>}

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-4">
              <svg viewBox="0 0 720 520" className="h-[420px] w-full rounded-[1.5rem] border border-white/10 bg-slate-900">
                <defs>
                  <linearGradient id="waterGradient" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#06213f" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                  <linearGradient id="landGradient" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#163d2f" />
                    <stop offset="100%" stopColor="#0f2d24" />
                  </linearGradient>
                  <linearGradient id="roadGradient" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#fde68a" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="720" height="520" fill="url(#waterGradient)" />
                <path d="M20 360 C120 280, 200 310, 260 260 S420 190, 520 230 S640 280, 700 210 L700 520 L20 520 Z" fill="url(#landGradient)" opacity="0.95" />
                <path d="M0 150 C90 120, 160 160, 230 140 S370 90, 470 130 S610 200, 720 150" fill="none" stroke="url(#roadGradient)" strokeWidth="4" strokeDasharray="10 8" opacity="0.65" />
                <path d="M40 70 C120 130, 190 110, 240 170 S360 250, 420 190 S560 110, 680 160" fill="none" stroke="#38bdf8" strokeWidth="3" opacity="0.35" />
                {Array.from({ length: 9 }).map((_, index) => (
                  <line key={`h-${index}`} x1="0" y1={60 * (index + 1)} x2="720" y2={60 * (index + 1)} stroke="rgba(148,163,184,0.08)" strokeOpacity="0.4" />
                ))}
                {Array.from({ length: 12 }).map((_, index) => (
                  <line key={`v-${index}`} x1={60 * (index + 1)} y1="0" x2={60 * (index + 1)} y2="520" stroke="rgba(148,163,184,0.08)" strokeOpacity="0.4" />
                ))}
                <text x="26" y="42" fill="#bfdbfe" fontSize="14">North</text>
                <text x="640" y="500" fill="#bfdbfe" fontSize="14">South-East</text>
                <circle cx="360" cy="260" r="54" fill="rgba(34,197,94,0.15)" stroke="rgba(74,222,128,0.8)" strokeWidth="2" />
                <circle cx="360" cy="260" r="8" fill="#4ade80" />
                <circle cx="360" cy="260" r="18" fill="none" stroke="rgba(74,222,128,0.25)" strokeWidth="10" />
                <text x="380" y="256" fill="#d1fae5" fontSize="16">{location.label}</text>
                <text x="380" y="276" fill="#cbd5e1" fontSize="12">
                  {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                </text>
                {svgPoints.map((point, index) => (
                  <g key={point.name}>
                    {(() => {
                      const projected = projectPoint(point.latitude, point.longitude)
                      return (
                        <>
                          <line x1={360} y1={260} x2={projected.x} y2={projected.y} stroke="rgba(148,163,184,0.35)" strokeDasharray="4 6" />
                          <circle cx={projected.x} cy={projected.y} r="10" fill={index % 2 === 0 ? "#38bdf8" : "#f59e0b"} />
                          <circle cx={projected.x} cy={projected.y} r="22" fill="none" stroke={index % 2 === 0 ? "rgba(56,189,248,0.18)" : "rgba(245,158,11,0.18)"} strokeWidth="8" />
                          <text x={projected.x + 14} y={projected.y + 4} fill="#e2e8f0" fontSize="14">
                            {point.name}
                          </text>
                        </>
                      )
                    })()}
                  </g>
                ))}
              </svg>
            </div>

            <div className="space-y-4">
              {centers.map((center) => (
                <article key={center.name} className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-white">{center.name}</h2>
                      <p className="mt-1 text-sm text-sky-200">{center.address}</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">{distanceLabel(center.distanceKm)}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {center.services.map((service) => (
                      <span key={service} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                        {service}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/health-insights" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-sky-300/40 hover:bg-white/10">
              Open insights
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
