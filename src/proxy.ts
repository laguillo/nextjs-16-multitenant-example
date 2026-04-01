// ============================================================
// src/proxy.ts — Next.js 16 (antes middleware.ts)
// ============================================================
// Responsabilidades:
//  1. Detectar el subdominio del tenant en el host
//  2. Reescribir la URL internamente a /[tenant]/... (transparente al usuario)
//  3. Proteger rutas autenticadas: redirige a /login si no hay sesión
// ============================================================

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { tenants } from "@/lib/tenants"

const COOKIE_NAME = "tenant-session"

// Subdominios válidos derivados de los datos hardcodeados
const VALID_SUBDOMAINS = new Set(tenants.map((t) => t.subdomain))

// Rutas públicas del tenant (no requieren autenticación)
const PUBLIC_PATHS = ["/login"]

/**
 * Extrae el subdominio de la request.
 * Intenta primero con request.url (más fiable en dev local),
 * luego hace fallback al header host.
 */
function extractSubdomain(request: NextRequest): string | null {
  const url = request.url
  const host = request.headers.get("host") || ""

  // Desarrollo local: parsear desde la URL completa es más fiable
  // porque Next.js dev server puede normalizar el header host
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    // "http://tenant1.localhost:3000/..." → match[1] = "tenant1"
    const match = url.match(/https?:\/\/([^.]+)\.localhost/)
    if (match?.[1]) return match[1]

    // Fallback: header host "tenant1.localhost:3000"
    const hostname = host.split(":")[0]
    if (hostname.includes(".localhost")) return hostname.split(".")[0]

    return null
  }

  // Producción: extraer subdominio del header host
  const hostname = host.split(":")[0]
  const parts = hostname.split(".")
  // "tenant1.example.com" → ["tenant1", "example", "com"] → subdomain = "tenant1"
  // "example.com" → ["example", "com"] → sin subdominio
  // "www.example.com" → ignorar "www"
  if (parts.length >= 3 && parts[0] !== "www") {
    return parts[0]
  }

  return null
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // Ignorar rutas internas de Next.js y archivos estáticos
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  const subdomain = extractSubdomain(request)

  // ----------------------------------------------------------------
  // Sin subdominio → landing page (localhost:3000)
  // ----------------------------------------------------------------
  if (!subdomain || !VALID_SUBDOMAINS.has(subdomain)) {
    return NextResponse.next()
  }

  // ----------------------------------------------------------------
  // Subdominio válido → rewrite interno a /[tenant]/...
  // El usuario sigue viendo "tenant1.localhost:3000/products"
  // pero Next.js sirve desde "/tenant1/products"
  // ----------------------------------------------------------------

  // Normalizamos: si la ruta ya empieza con /[tenant]/ lo saltamos
  const tenantPrefix = `/${subdomain}`
  const rewritePath = pathname.startsWith(tenantPrefix)
    ? pathname
    : `${tenantPrefix}${pathname}`

  // ----------------------------------------------------------------
  // Auth guard: rutas protegidas del tenant
  // ----------------------------------------------------------------
  const isPublicPath = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  )

  const session = request.cookies.get(COOKIE_NAME)

  if (!isPublicPath && !session) {
    // Redirige a la página de login del mismo subdominio
    const loginUrl = new URL(`/login`, request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isPublicPath && session) {
    // Ya está autenticado, redirige al dashboard
    return NextResponse.redirect(new URL("/", request.url))
  }

  // ----------------------------------------------------------------
  // Rewrite transparente
  // ----------------------------------------------------------------
  const rewriteUrl = new URL(`${rewritePath}${search}`, request.url)
  const response = NextResponse.rewrite(rewriteUrl)

  // Pasamos el subdominio del tenant como header para que las páginas
  // puedan leerlo sin necesidad de parsear el host de nuevo
  response.headers.set("x-tenant", subdomain)

  return response
}

export const config = {
  matcher: [
    // Ejecutar proxy en todas las rutas excepto archivos estáticos e internos de Next
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
