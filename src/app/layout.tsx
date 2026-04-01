import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Multi-Tenant App — Next.js 16",
  description: "Demo de arquitectura multi-tenant con Next.js 16 y subdominios",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased bg-gray-50 text-gray-900">{children}</body>
    </html>
  )
}
