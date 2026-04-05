import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Footer from "@/components/footer"

export default function HeroPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_30%),linear-gradient(180deg,_#08111d_0%,_#020617_100%)]">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  )
}
