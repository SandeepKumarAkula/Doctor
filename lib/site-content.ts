export type NavLink = {
  href: string
  label: string
}

export const navLinks: NavLink[] = [
  { href: "/health-check", label: "AarogyaMitra AI" },
  { href: "/find-doctor", label: "AarogyaConnect" },
  { href: "/g-map", label: "AarogyaMap" },
  { href: "/news-help", label: "AarogyaPulse" },
  { href: "/health-insights", label: "AarogyaView" },
  { href: "/manage", label: "Control Center" },
]

export const quickStats = [
  { label: "Agents", value: "04" },
  { label: "Languages", value: "06" },
  { label: "Synthetic cases", value: "120+" },
  { label: "Offline ready", value: "Yes" },
]
