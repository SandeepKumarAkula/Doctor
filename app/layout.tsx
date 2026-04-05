import "./globals.css"
import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "GramAarogya - Offline Rural Health AI",
  description: "A self-contained rural healthcare platform powered by synthetic data and local AI agents.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}