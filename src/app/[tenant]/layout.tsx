import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { getTenantBySubdomain } from "@/lib/tenants"
import TenantNavbar from "@/components/TenantNavbar"

// Next.js 16: LayoutProps es un helper global (no requiere import)
// Se genera automáticamente con `next dev` / `next build`
export default async function TenantLayout({
  children,
  params,
}: LayoutProps<"/[tenant]">) {
  const { tenant: tenantSlug } = await params

  // Obtener datos del tenant
  const tenant = getTenantBySubdomain(tenantSlug)
  if (!tenant) notFound()

  // Leer sesión desde la cookie
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("tenant-session")

  let userName = "Usuario"
  let userRole = "Viewer"

  if (sessionCookie?.value) {
    try {
      const session = JSON.parse(sessionCookie.value)
      userName = session.name ?? userName
      userRole = session.role ?? userRole
    } catch {
      // Cookie malformada — el proxy ya redirigirá al login
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TenantNavbar
        tenant={tenant}
        userName={userName}
        userRole={userRole}
      />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6">
        {children}
      </main>
      <footer className="border-t border-gray-200 bg-white py-3">
        <p className="text-center text-xs text-gray-400">
          <span className="font-mono">{tenant.subdomain}.localhost:3000</span>
          {" · "}
          Tenant ID: <span className="font-mono">{tenant.id}</span>
          {" · "}
          Plan: {tenant.plan}
        </p>
      </footer>
    </div>
  )
}
